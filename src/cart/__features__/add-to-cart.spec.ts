import { describeFeature, loadFeatureFromText } from "@amiceli/vitest-cucumber";
import { expect } from "vitest";
import { useCartViewModel } from "../useCartViewModel";
import type { CartItemDTO, AddToCartPayload } from "../cartService";
import raw from "./add-to-cart.feature?raw";
const feature = await loadFeatureFromText(raw);

describeFeature(feature, ({ Scenario }) => {
  Scenario(
    "Add a new item to an empty cart",
    ({ Given, When, Then, And, But }) => {
      let fakeDb: CartItemDTO[];

      const inMemoryService = {
        fetchCart: async () => {
          return [...fakeDb];
        },
        addToCart: async (payload: AddToCartPayload) => {
          const id = `${Date.now()}`;
          fakeDb.push({
            id,
            name: payload.name,
            priceCents: 100,
            qty: payload.qty,
          });
        },
        removeFromCart: async (_id: string) => {},
      };

      let vmResult: Awaited<ReturnType<typeof useCartViewModel>>;

      Given("the cart is empty", async (_ctx) => {
        fakeDb = [];
        vmResult = await useCartViewModel(inMemoryService);
        expect(vmResult.cartItemsModel.length).toBe(0);
      });

      When(
        "I add {string} with quantity {int}",
        async (_ctx, name: string, qty: number) => {
          await vmResult.handleAddToCart(name, qty);
        }
      );

      Then(
        "I should see {int} item in the cart named {string} with quantity {int}",
        async (_ctx, count: number, name: string, qty: number) => {
          const refreshed = await useCartViewModel(inMemoryService);
          expect(refreshed.cartItemsModel.length).toBe(count);
          expect(refreshed.cartItemsModel[0]).toMatchObject({
            label: name,
            quantity: qty,
          });
        }
      );
    }
  );
});
