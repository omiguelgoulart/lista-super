export type Role = "owner" | "editor" | "viewer";
export type Member = { id:string; name:string; email:string; role:Role };
export type Item = { id:string; cat:string; name:string; qty:number; unit:string; note?:string; checked:boolean };
export type ListColor = "green"|"blue"|"violet"|"orange"|"rose"|"teal";
export type ListIcon = "basket"|"cart"|"apple"|"milk"|"leaf"|"sparkles";
export type ShoppingList = { id:string; name:string; icon:ListIcon; color:ListColor; members:Member[]; items:Item[]; itemCount?:number };
