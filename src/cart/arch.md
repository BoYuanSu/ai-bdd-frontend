```mermaid
flowchart TD
   API[API Service]
   Adapter[Adapter]
   VM[View Model]
   Ft[Feature Container]
   UI[UI Component]


API --> Adapter --> VM --> Ft --> UI
```