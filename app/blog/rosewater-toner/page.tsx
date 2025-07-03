import Image from "next/image";

export default function RosewaterBlog() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pt-32 md:pt-36">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-sage">Rosewater: Nature's Toner</h1>
      <Image src="/images/products/rosewater.jpeg" alt="Rosewater" width={800} height={400} className="w-full h-64 object-cover rounded-lg mb-6" />
      <p className="mb-4">Rosewater is a gentle, natural toner that balances your skin's pH and tightens pores. Its anti-inflammatory properties help reduce redness and soothe sensitive skin.</p>
      <p className="mb-4">Spritz rosewater after cleansing to refresh and hydrate, or use it throughout the day for a dewy, revitalized look. It’s perfect for all skin types and a must-have in your daily skincare routine.</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Balances skin pH</li>
        <li>Tightens pores</li>
        <li>Reduces redness and irritation</li>
        <li>Hydrates and refreshes</li>
      </ul>
      <a href="/products/pure-rose-water" className="text-sage font-semibold underline">Shop Rosewater</a>
      <h2 className="text-2xl font-bold mt-10 mb-4 text-sage">How to Use Rosewater</h2>
      <p className="mb-4">After cleansing, spritz rosewater directly onto your face or apply with a cotton pad. Let it absorb before following with your favorite moisturizer. Rosewater can also be used to refresh your skin throughout the day or to set makeup for a natural, dewy finish.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4 text-sage">Benefits of Unik Naturals Pure Rose Water</h2>
      <p className="mb-4">Our rosewater is steam-distilled from fresh rose petals, ensuring purity and potency. It’s free from alcohol and artificial additives, making it gentle enough for all skin types. Enjoy the subtle floral scent and the instant hydration it provides.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4 text-sage">DIY Beauty Recipes</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Mix rosewater with aloe vera gel for a calming after-sun spray.</li>
        <li>Add a splash to your bath for a luxurious, aromatic soak.</li>
        <li>Combine with clay powder for a soothing face mask.</li>
      </ul>
    </div>
  );
}
