import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center text-sage">Unik Naturals Blog</h1>
      <div className="grid md:grid-cols-3 gap-10">
        {/* Blog 1 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-slideUp">
          <Image src="/images/products/aloevera gel.jpeg" alt="Benefits of Aloe Vera for Skin" width={600} height={400} className="w-full h-48 object-cover" />
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Benefits of Aloe Vera for Skin</h2>
            <p className="text-gray-600 mb-4">Aloe vera is a powerhouse of hydration and healing. Its natural gel soothes sunburn, calms irritation, and deeply moisturizes the skin. Rich in vitamins, enzymes, and antioxidants, aloe vera helps repair damaged skin, reduce redness, and promote a healthy, glowing complexion. Use it daily as a gentle moisturizer or as a calming mask after sun exposure for best results.</p>
            <Link href="/products/aloevera-gel" className="text-sage font-semibold underline">Shop Aloe Vera Gel</Link>
          </div>
        </div>
        {/* Blog 2 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-slideUp delay-200">
          <Image src="/images/products/rosewater.jpeg" alt="Rosewater: Nature's Toner" width={600} height={400} className="w-full h-48 object-cover" />
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Rosewater: Nature's Toner</h2>
            <p className="text-gray-600 mb-4">Rosewater is a gentle, natural toner that balances your skin's pH and tightens pores. Its anti-inflammatory properties help reduce redness and soothe sensitive skin. Spritz rosewater after cleansing to refresh and hydrate, or use it throughout the day for a dewy, revitalized look. It’s perfect for all skin types and a must-have in your daily skincare routine.</p>
            <Link href="/products/rosewater" className="text-sage font-semibold underline">Shop Rosewater</Link>
          </div>
        </div>
        {/* Blog 3 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-slideUp delay-400">
          <Image src="/images/products/soaps.jpeg" alt="Choosing the Right Soap" width={600} height={400} className="w-full h-48 object-cover" />
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Choosing the Right Soap</h2>
            <p className="text-gray-600 mb-4">Natural soaps are crafted with nourishing oils and botanical extracts that cleanse without stripping your skin. When choosing a soap, look for ingredients like coconut oil, olive oil, and essential oils for gentle cleansing and hydration. Avoid harsh chemicals and artificial fragrances to keep your skin healthy and balanced. Our handmade soaps are suitable for all skin types and leave your skin feeling soft and refreshed.</p>
            <Link href="/products/soaps" className="text-sage font-semibold underline">Shop Soaps</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
