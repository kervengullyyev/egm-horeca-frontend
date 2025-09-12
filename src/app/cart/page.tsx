import CartClient from "@/components/CartClient";

export default function CartPage() {
	return (
		<main className="min-h-screen font-sans">
			<div className="mx-auto max-w-7xl px-4 py-8">
				<h1 className="mb-8 text-3xl font-semibold tracking-tight">Cart</h1>
				<CartClient />
			</div>
		</main>
	);
}
