import Link from "next/link";

export default function SingleVideoFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600/10">
          <span className="text-3xl">▶</span>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-white">
          Watch this on Khair
        </h1>
        <p className="mb-8 text-gray-400">
          Download the Khair app to watch this video and explore more.
        </p>

        <Link
          href="https://play.google.com/store/apps/details?id=com.abdalah_ameer.khairmobilev"
          className="inline-block w-full rounded-lg bg-red-600 px-6 py-3 font-medium text-white"
        >
          Get it on Google Play
        </Link>
      </div>
    </div>
  );
}
