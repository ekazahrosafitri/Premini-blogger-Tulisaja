"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArtikelType, TagsType } from "@/lib/typedata";
import { byIdArtikel } from "@/lib/backend/Artikel";
import Loading from "@/components/ui/Loading";
import { use } from "react";
import { ArrowLeft } from 'lucide-react';

function PageDetailArtikel({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const parameter = use(params);
  const [artikel, setArtikel] = useState<ArtikelType>({} as ArtikelType);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const data = await byIdArtikel({ id: parseInt(parameter.id) });
      if (!data.success) {
        router.push("/404");
      } else {
        setArtikel(data.data);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <Loading text={"Memuat Data Artikel..."} />;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 text-white">
      {/* Tombol Kembali */}
      <button
        onClick={() => router.back()}
        className="text-md text-blue-400 flex items-center gap-1"
      >
        <ArrowLeft size={18}/> Kembali
      </button>

      {/* Banner */}
      {artikel.banner && (
        <img
          src={
            process.env.NEXT_PUBLIC_BASE_URL_IMAGE + artikel.banner ||
            "/artikels/artikel.jpeg"
          }
          alt="Banner Artikel"
          className="w-full h-64 object-cover rounded-xl shadow-lg"
        />
      )}

      {/* Judul */}
      <h1 className="text-3xl font-bold">{artikel.judul_artikel}</h1>

      {/* Tags */}
      {artikel.tags && artikel.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {artikel.tags.map((tag: TagsType, index: number) => (
            <span
              key={index}
              className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
            >
              {tag.tag}
            </span>
          ))}
        </div>
      )}

      {/* Info Penulis & Tanggal */}
      <div className="text-sm text-gray-400">
        Ditulis oleh{" "}
        <span className="text-white font-medium">{artikel.user?.name}</span> ·{" "}
        {new Date(artikel.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>

      {/* Isi Artikel */}
      <div className="prose prose-invert max-w-none text-white leading-relaxed tiptap">
        <div dangerouslySetInnerHTML={{ __html: artikel.isi }}></div>
      </div>
    </div>
  );
}

export default PageDetailArtikel;
