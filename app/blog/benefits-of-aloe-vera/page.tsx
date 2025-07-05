import Image from "next/image";

export default function AloeVeraBlog() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pt-32 md:pt-36">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-sage">Benefits of Aloe Vera for Skin</h1>
      <Image src="/images/products/aloevera gel.jpeg" alt="Aloe Vera Gel" width={800} height={400} className="w-full h-72 md:h-96 object-contain rounded-lg mb-6 bg-white p-4" priority />
      <p className="mb-4">Aloe vera is a powerhouse of hydration and healing. Its natural gel soothes sunburn, calms irritation, and deeply moisturizes the skin. Rich in vitamins, enzymes, and antioxidants, aloe vera helps repair damaged skin, reduce redness, and promote a healthy, glowing complexion.</p>
      <p className="mb-4">Use it daily as a gentle moisturizer or as a calming mask after sun exposure for best results. Our Unik Naturals Aloe Vera Gel is pure, lightweight, and suitable for all skin types.</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Soothes sunburn and irritation</li>
        <li>Deeply hydrates and nourishes</li>
        <li>Promotes skin healing and repair</li>
        <li>Reduces redness and inflammation</li>
      </ul>
      <a href="/products" className="text-sage font-semibold underline">Shop Aloe Vera Gel</a>
      <h2 className="text-2xl font-bold mt-10 mb-4 text-sage">How to Use Aloe Vera Gel in Your Routine</h2>
      <p className="mb-4">Apply a thin layer of aloe vera gel to clean skin as a daily moisturizer, or use it as a soothing mask after sun exposure. For hair, massage into the scalp to calm irritation and boost hydration. You can also mix aloe vera gel with a few drops of essential oil for a custom face or hair treatment.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4 text-sage">Why Choose Unik Naturals Aloe Vera Gel?</h2>
      <p className="mb-4">Our aloe vera gel is made from pure, cold-pressed aloe leaves, ensuring maximum potency and freshness. It’s free from artificial colors, fragrances, and parabens, making it safe for even the most sensitive skin. Experience the difference of nature’s best with Unik Naturals.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4 text-sage">Customer Tips</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Keep your aloe vera gel in the fridge for an extra cooling effect in summer.</li>
        <li>Use as a primer before makeup for a smooth, hydrated base.</li>
        <li>Apply to bug bites or minor burns for quick relief.</li>
      </ul>
    </div>
  );
}
