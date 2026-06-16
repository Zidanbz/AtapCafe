export function MenuHero() {
  return (
    <section className="relative overflow-hidden bg-[#7c6746] px-8 pb-14 pt-11 text-white">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(47,31,18,0.9), rgba(137,109,67,0.78)), url(https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <h1 className="font-display relative mx-auto max-w-[285px] text-center text-[31px] leading-[1.02]">
        Tempat terbaik untuk <em className="text-[#d2b176]">bertemu</em> dan menikmati.
      </h1>
    </section>
  );
}
