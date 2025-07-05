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
          <Image src="/images/products/herbel hair oil.jpeg" alt="Herbal Hair Oil" width={600} height={400} className="w-full h-48 object-cover" />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Why Herbal Hair Oil is a Must for Healthy Hair</h3>
            <p className="text-gray-600 mb-4">Discover the natural power of our Herbal Hair Oil, crafted with a blend of nourishing herbs and essential oils. This oil helps reduce hair fall, promotes hair growth, and keeps your scalp healthy and dandruff-free. Regular use strengthens roots, adds shine, and revitalizes dull hair without harsh chemicals.</p>
            <Link href="/blog/herbal-hair-oil" className="text-sage font-semibold underline">Read More</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
