import Image from "next/image";

export default function HerbalHairOilBlog() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Why Herbal Hair Oil is a Must for Healthy Hair</h1>
      <Image
        src="/images/products/herbel hair oil.jpeg"
        alt="Herbal Hair Oil"
        width={800}
        height={400}
        className="w-full h-72 md:h-96 object-contain rounded-lg mb-6 bg-white p-4"
        priority
      />
      <p className="mb-4">
        Our Herbal Hair Oil is a unique blend of natural herbs and essential oils designed to nourish your scalp and strengthen your hair from root to tip. Free from harsh chemicals, it helps reduce hair fall, promotes new hair growth, and keeps your scalp healthy and dandruff-free.
      </p>
      <p className="mb-4">
        <b>Key Benefits:</b>
        <ul className="list-disc ml-6">
          <li>Reduces hair fall and breakage</li>
          <li>Promotes healthy hair growth</li>
          <li>Soothes dry and itchy scalp</li>
          <li>Adds natural shine and softness</li>
          <li>Made with 100% natural ingredients</li>
        </ul>
      </p>
      <p className="mb-4">
        <b>How to Use:</b> Massage a small amount of oil into your scalp and hair. Leave it on for at least an hour or overnight for best results. Wash with a mild shampoo. Use 2-3 times a week for optimal benefits.
      </p>
      <a
        href="/products/herbel-hair-oil"
        className="inline-block mt-6 px-6 py-2 bg-sage text-white rounded font-semibold"
      >
        Shop Herbal Hair Oil
      </a>
    </div>
  );
}
