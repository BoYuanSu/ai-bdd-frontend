### 以開發者為中心的 BDD 實作流程

這個流程的核心是**圍繞 Gherkin 的 `Given-When-Then` 結構，分階段完成「測試撰寫」與「程式實作」的交錯循環**。每一步都以前一步的失敗為驅動，目標清晰。

#### **起點：定義契約 (The Contract)**

1.  **撰寫 Feature File (`add-to-cart.feature`)**
    *   **目的**: 與團隊（PM、設計師、QA）共同定義功能的「驗收標準」。這是所有後續開發的唯一真相來源。
    *   **產出**:
        ```gherkin
        Feature: Add to Cart
          為了讓使用者可以購買商品，他們需要能將商品加入購物車

          Scenario: 將商品成功加入空的購物車
            Given 一位使用者在商品頁面，而系統已準備好處理購物車請求
            When 他將一個商品加入購物車
            Then 購物車內應該會出現該項商品
        ```

#### **階段一：建立場景 (Implementing `Given`)**

目標：讓測試環境能夠模擬出 `Given` 所描述的初始狀態。

2.  **建立 Spec 骨架 (`add-to-cart.spec.ts`)**
    *   **目的**: 將 Feature 檔案轉譯為測試程式碼的骨架。此時所有步驟都是空的，執行測試會提示 "step definition pending"。
    *   **產出**:
        ```typescript
        // src/cart/__features__/add-to-cart.spec.ts
        import { loadFeature, defineFeature } from 'vitest-cucumber';
        // ... 其他 imports

        const feature = loadFeature('./add-to-cart.feature');

        defineFeature(feature, (test) => {
          test('將商品成功加入空的購物車', ({ given, when, then }) => {
            given('一位使用者在商品頁面，而系統已準備好處理購物車請求', () => {
              // TODO: 準備測試環境
            });
            when('他將一個商品加入購物車', () => {
              // TODO: 模擬使用者互動
            });
            then('購物車內應該會出現該項商品', () => {
              // TODO: 斷言結果
            });
          });
        });
        ```

3.  **實作 `Given` - Part 1: 模擬 API (Mocking)**
    *   **目的**: 根據 API 規格，使用 MSW (Mock Service Worker) 攔截並模擬後端回應。這讓我們可以獨立於後端進行開發。
    *   **產出 (setup.ts 或 `__mocks__/handlers.ts`)**:
        ```typescript
        // 在 MSW 的 handlers 中
        import { http, HttpResponse } from 'msw';

        export const handlers = [
          // 模擬加入購物車成功的 API
          http.post('/api/cart', async ({ request }) => {
            const { productId, quantity } = await request.json();
            return HttpResponse.json({
              id: 'cart-item-1',
              productId,
              quantity,
            });
          }),
        ];
        ```

4.  **實作 `Given` - Part 2: 服務層 (Service Layer)**
    *   **目的**: 撰寫 `cartService.ts`，它負責與 API 溝通。現在它可以直接對著我們剛建立的 Mock API 進行開發和測試。
    *   **產出 (`cartService.ts`)**:
        ```typescript
        // src/cart/cartService.ts
        import type { CartItem } from './cartModels';

        export const cartService = {
          async addToCart(productId: string): Promise<CartItem> {
            const response = await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId, quantity: 1 }),
            });
            if (!response.ok) {
              throw new Error('Failed to add to cart');
            }
            return response.json();
          },
        };
        ```

5.  **實作 `Given` - Part 3: 渲染容器 (Feature Container)**
    *   **目的**: 在 Spec 測試的 `given` 區塊中，渲染包含此功能的「整合元件」（例如 `CartModule`），並傳入必要的 props。
    *   **產出 (更新 `add-to-cart.spec.ts`)**:
        ```typescript
        // ...
        import { render } from '@testing-library/vue';
        import CartModule from '../CartModule.tsx'; // 這個檔案現在需要被建立

        // ...
        given('一位使用者在商品頁面，而系統已準備好處理購物車請求', () => {
          // 渲染整合元件，讓場景準備就緒
          render(CartModule, { props: { productId: 'product-abc' } });
        });
        // ...
        ```
    *   **執行測試**: `given` 步驟現在可以通過了。但 `when` 和 `then` 依然是空的。

#### **階段二：觸發行為 (Implementing `When`)**

目標：模擬使用者的操作，並建立對應的 UI 元件來回應這些操作。

6.  **實作 `When` - Part 1: 使用者互動測試**
    *   **目的**: 在 `when` 區塊中，使用 Testing Library 尋找 UI 元素並觸發事件。這會失敗，因為 UI 元件還不存在。
    *   **產出 (更新 `add-to-cart.spec.ts`)**:
        ```typescript
        // ...
        when('他將一個商品加入購物車', async () => {
          // 尋找按鈕並點擊，這會驅動我們去建立 AddToCart 元件
          const addButton = await screen.findByRole('button', { name: /加入購物車/i });
          await fireEvent.click(addButton);
        });
        // ...
        ```

7.  **實作 `When` - Part 2: UI 元件層 (Component Layer)**
    *   **目的**: 為了讓上一步的測試通過，我們建立 `AddToCart.tsx` 元件。它包含一個按鈕，但點擊事件暫時是空的。
    *   **產出 (`components/AddToCart.tsx`)**:
        ```tsx
        // src/cart/components/AddToCart.tsx
        import { defineComponent } from 'vue';

        export default defineComponent({
          // ... props, setup ...
          render() {
            return <button onClick={this.handleAddToCart}>加入購物車</button>;
          },
          methods: {
            handleAddToCart() {
              // TODO: 呼叫 ViewModel 的方法
              console.log('Button clicked!');
            }
          }
        });
        ```
    *   **執行測試**: `when` 步驟現在可以找到按鈕並點擊了，測試前進到 `then`。

#### **階段三：驗證結果 (Implementing `Then`)**

目標：斷言使用者操作後系統狀態的改變，並建立 ViewModel 來管理這個狀態。

8.  **實作 `Then` - Part 1: 撰寫斷言 (Expectations)**
    *   **目的**: 在 `then` 區塊中，撰寫斷言來驗證 UI 是否如預期更新。這會失敗，因為狀態沒有被管理和反映到畫面上。
    *   **產出 (更新 `add-to-cart.spec.ts`)**:
        ```typescript
        // ...
        then('購物車內應該會出現該項商品', async () => {
          // 斷言畫面上出現了新的購物車項目
          // 這會驅動我們去實作 ViewModel 和更新 CartModule
          const cartItem = await screen.findByTestId('cart-item-product-abc');
          expect(cartItem).toBeInTheDocument();
          expect(cartItem.textContent).toContain('product-abc');
        });
        // ...
        ```

9.  **實作 `Then` - Part 2: 視圖模型 (View Model)**
    *   **目的**: 建立 `useCartViewModel.ts`，它是 UI 和 Service 之間的橋樑。它管理狀態 (`cartItems`) 並提供方法 (`addToCart`) 給 UI 元件呼叫。
    *   **產出 (`useCartViewModel.ts`)**:
        ```typescript
        // src/cart/useCartViewModel.ts
        import { ref } from 'vue';
        import { cartService } from './cartService';
        import type { CartItem } from './cartModels';

        export function useCartViewModel() {
          const cartItems = ref<CartItem[]>([]);

          const addToCart = async (productId: string) => {
            try {
              const newItem = await cartService.addToCart(productId);
              cartItems.value.push(newItem);
            } catch (error) {
              // 處理錯誤
            }
          };

          return { cartItems, addToCart };
        }
        ```

10. **整合與完成**
    *   **目的**: 將 ViewModel 串連到 `CartModule` 和 `AddToCart` 元件中，讓整個流程完整。
    *   **修改 `AddToCart.tsx`**: 呼叫從 ViewModel 傳入的 `addToCart` 方法。
    *   **修改 `CartModule.tsx`**: 使用 ViewModel 的 `cartItems` 來渲染購物車列表。
    *   **執行測試**: 現在，整個 Spec Test 應該會**轉為綠燈**！

#### **終點：重構 (Refactor)**

*   **目的**: 在所有測試都通過的前提下，安心地改善程式碼品質。
*   **可能的操作**:
    *   清理 `console.log`。
    *   將重複的邏輯抽取成共用函式。
    *   改善變數命名。
    *   為 `useCartViewModel` 或 `cartService` 補上更細緻的單元測試。

這個流程將您的想法具體化，形成了一個清晰、可重複、且高度自動化的開發循環。每一步的產出都直接回應了測試失敗的需求，確保了每一行程式碼都有其存在的價值。