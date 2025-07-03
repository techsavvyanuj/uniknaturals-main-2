import Image from "next/image";

export default function ChoosingSoapBlog() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pt-32 md:pt-36">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-sage">Choosing the Right Soap</h1>
      <Image src="/images/products/soaps.jpeg" alt="Natural Soaps" width={800} height={400} className="w-full h-64 object-cover rounded-lg mb-6" />
      <p className="mb-4">Natural soaps are crafted with nourishing oils and botanical extracts that cleanse without stripping your skin. When choosing a soap, look for ingredients like coconut oil, olive oil, and essential oils for gentle cleansing and hydration.</p>
      <p className="mb-4">Avoid harsh chemicals and artificial fragrances to keep your skin healthy and balanced. Our handmade soaps are suitable for all skin types and leave your skin feeling soft and refreshed.</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Made with natural oils and extracts</li>
        <li>Gentle cleansing for all skin types</li>
        <li>Free from harsh chemicals</li>
        <li>Leaves skin soft and hydrated</li>
      </ul>
      <a href="/products" className="text-sage font-semibold underline">Shop Soaps</a>
      <h2 className="text-2xl font-bold mt-10 mb-4 text-sage">How to Choose the Best Soap for Your Skin</h2>
      <p className="mb-4">Consider your skin type and any sensitivities when selecting a soap. For dry skin, look for moisturizing ingredients like shea butter and olive oil. For oily or acne-prone skin, choose soaps with tea tree or neem. Always avoid harsh detergents and synthetic fragrances.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4 text-sage">Why Unik Naturals Soaps?</h2>
      <p className="mb-4">Our soaps are handmade in small batches using traditional methods. We use only natural oils, plant extracts, and pure essential oils to create gentle, effective cleansers for every skin type. Each bar is free from parabens, sulfates, and artificial colors.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4 text-sage">Tips for Healthy Skin</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Store your soap on a well-drained dish to make it last longer.</li>
        <li>Use lukewarm water to avoid drying out your skin.</li>
        <li>Follow up with a natural moisturizer after cleansing.</li>
      </ul>
    </div>
  );
}
