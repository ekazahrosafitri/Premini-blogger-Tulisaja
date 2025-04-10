"use client"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { semuaUser } from "@/lib/backend/User";
import { semuaTag } from "@/lib/backend/Tag";
import { semuaKategori } from "@/lib/backend/Kategori";
import { useState, useEffect } from "react";
import { UserType, TagsType, KategoriType, ArtikelType, UserLogin } from "@/lib/typedata";
import { Token } from "@/lib/Authenticate";
import { useRouter } from "next/navigation";
import { LoadingCircle } from "@/components/ui/Loading";
import { X, Heading1, Heading3, Heading2, Heading4, Heading5, Heading6, Bold, Italic, Strikethrough, AlignRight, AlignCenter, AlignLeft, AlignJustify, Highlighter } from 'lucide-react';
import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { byIdArtikel, createArtikel, editArtikel } from "@/lib/backend/Artikel";
import Helper from "@/lib/Helper";
import { LoadingText } from '../../ui/Loading';


export const artikelValidationCreate = (validKategori: number[], validUser: number[], validTags: number[]) => 
  z.object({
    judul_artikel: z.string().min(5, "Minimal 5 Huruf")
                    .max(100, "Maximal 100 Huruf"),
    isi: z.string().min(100, "Minimal 100 Huruf"),
    kategori_id: z.number().refine((val) => validKategori.includes(val), {
      message: "Kategori Ini Tidak Valid"
    }),
    user_id: z.number().refine((val) => validUser.includes(val), {
      message: "User Ini Tidak Valid"
    }),
    tags: z.array(z.number()).min(1, "Minimal Ada 1 Tag Yang Dipilih").refine((tags) => 
      tags.every((tag) => validTags.includes(tag)), { message: "Salah Satu Tag Mungkin Tidak Valid" }),
    banner: z
      .instanceof(File, { message: "File tidak valid" })
      .refine((file) => ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type), {
        message: "Foto profil harus JPG, PNG, JPEG, atau WEBP",
    }),

  });

export const artikelValidationEdit = (validKategori: number[], validUser: number[], validTags: number[]) => 
  z.object({
    judul_artikel: z.string().min(5, "Minimal 5 Huruf")
                    .max(100, "Maximal 100 Huruf"),
    isi: z.string().min(100, "Minimal 100 Huruf"),
    kategori_id: z.number().refine((val) => validKategori.includes(val), {
      message: "Kategori Ini Tidak Valid"
    }),
    user_id: z.number().refine((val) => validUser.includes(val), {
      message: "User Ini Tidak Valid"
    }),
    tags: z.array(z.number()).min(1, "Minimal Ada 1 Tag Yang Dipilih").refine((tags) => 
      tags.every((tag) => validTags.includes(tag)), { message: "Salah Satu Tag Mungkin Tidak Valid" }),
    banner: z
    .union([
      z.instanceof(File).refine(
        (file) => ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file?.type || ""),
        { message: "Foto profil harus JPG, PNG, JPEG, atau WEBP" }
      ),
      z.literal(undefined), // Mengizinkan nilai undefined (tidak upload file)
      z.literal(null), // Jika ingin mengizinkan null juga
    ]),

  });

function ArtikelProp({openModal = false, dariList = true, user, modalType = "create", idArtikel, onClose, onSaveReload, setSukses, setAlertCountdown, timeDeleteAlert} : {openModal: boolean, dariList?: boolean, user: UserLogin, modalType?: "create" | "update", idArtikel?: number, onClose: () => void, onSaveReload?: () => void, setSukses: (message: string) => void, setAlertCountdown: (countdown: number) => void, timeDeleteAlert: number}) {
    const route = useRouter();
    const [loadingTag, setLoadingTag] = useState<boolean>(false);
    const [loadingKategori, setLoadingKategori] = useState<boolean>(false);
    const [loadingUser, setLoadingUser] = useState<boolean>(false);
    const [validTag, setValidTag] = useState<number[]>([]);
    const [validKategori, setValidKategori] = useState<number[]>([]);
    const [validUser, setValidUser] = useState<number[]>([]);
    const [kategoriSelect, setKategoriSelect] = useState<KategoriType[] | []>([]);
    const [userSelect, setUserSelect] = useState<UserType[] | []>([]);
    const [dataTags, setDataTags] = useState<TagsType[] | []>([]);
    const [selectTags, setSelectTags] = useState<TagsType[]>([]);
    const [searchTags, setSearchTags] = useState("");
    const [loadingSearchTags, setLoadingSearchTags] = useState(false);
    const [errorSearchTags, setErrorSearchTags] = useState("");
    const [token, setToken] = useState<string>("");
    const [formData, setFormData] = useState<{
        judul_artikel: string,
        isi: string,
        kategori_id: number,
        user_id: number,
        tags: number[],
        banner: File | null,
        previewBanner: string
    }>({
        judul_artikel: "",
        isi: "",
        kategori_id: 0,
        user_id: 0,
        tags: [],
        banner: null as File | null,
        previewBanner: "",
    });
    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
    const [errorForm, setErrorForm] = useState<string>("");
    const [loadingSave, setLoadingSave] = useState(false);
    const [contentTipTap, setContentTipTap] = useState("");
    const [loadingForm, setLoadingForm] = useState(false);

    const editor = useEditor({
      extensions: [
        StarterKit,
        // Heading.configure({levels: [1,2,3,4,5,6]}),
        TextAlign.configure({
          types: ['heading', 'paragraph']
        }),
        Highlight,
      ],
      content: contentTipTap,
      onUpdate: ({ editor }) => {
        setContentTipTap(editor.getHTML())
      },
      editorProps: {
        attributes: {
          class: "min-h-[150px] border rounded bg-gray-800 py-2 px-3",
        }
      }
    })

    useEffect(() => {
      if(editor) {
        editor.commands.setContent(contentTipTap);
      }
    }, [contentTipTap, editor])

    useEffect(() => {
        async function fetchToken() {
            const token = await Token();
            if(token != "") {
              setToken(token);
            } else {
              route.push("/login");
            }
        }

        fetchToken();
    }, [])


    async function fetchDataUser(tokenAccess: string) {
        setLoadingUser(true);
        const data = await semuaUser({token: tokenAccess}); 
        const userId = data.map((user: UserType) => user.id)
        setValidUser(userId);
        setUserSelect(data)
        setLoadingUser(false);
    }

    async function fetchDataKategori() {
        setLoadingKategori(true);
        const data = await semuaKategori({}); 
        const kategoriId = data.map((user: UserType) => user.id)
        setValidKategori(kategoriId);
        setKategoriSelect(data)
        setLoadingKategori(false);
    }

    async function fetchDataTags() {
        setLoadingTag(true);
        const data = await semuaTag({}); 
        const tagId = data.map((tag: TagsType) => tag.id)
        setValidTag(tagId);
        setDataTags(data)
        setLoadingTag(false);
    }

    const addTagSelect = (tag: TagsType) => {
        if(!selectTags.includes((tag))) {
          setSelectTags([...selectTags, tag])
        }

        setSearchTags("");
    }

    const removeTag = (tagId: number) => {
        setSelectTags(selectTags.filter((tag) => tag.id != tagId));
    }

    const filterTags = dataTags.filter((tag) => tag.tag.toLowerCase().includes(searchTags.toLowerCase()));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            banner: file,
            previewBanner: URL.createObjectURL(file),
        });
        }
    };

    useEffect(() => {
        if(openModal && token) {
          if(dariList) {
            fetchDataUser(token);
          } else {
            setValidUser([user.user.id]);
          }
            fetchDataKategori();
            fetchDataTags();
        }

        if(openModal == false) {
            setFormData({
                judul_artikel: "",
                isi: "",
                kategori_id: 0,
                user_id: dariList ? 0 : user.user.id,
                tags: [],
                banner: null as File | null,
                previewBanner: "",
            });
            
            setErrorMessages({});
            setErrorForm('')
            setContentTipTap('');
            setSelectTags([]);
        }
    }, [openModal, token])

    useEffect(() => {
      if(modalType == "update" && idArtikel) {
        const getDataArtikel = async () => {
          setLoadingForm(true)
          const {data} = await byIdArtikel({id: idArtikel});  
          setFormData({
            judul_artikel: data.judul_artikel,
            isi: data.isi,
            kategori_id: data.kategori_id,
            user_id: dariList ? data.user_id : user.user.id,
            tags: data.tags.map((tag: TagsType) => tag.id),
            banner: null,
            previewBanner: process.env.NEXT_PUBLIC_BASE_URL_IMAGE + data.banner
          });
          setContentTipTap(data.isi);
          setSelectTags(data.tags);

          setLoadingForm(false);
        }

        getDataArtikel();
      }
    }, [modalType, idArtikel]);

    // Handle submit
    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        if(loadingSave) return;

        setLoadingSave(true);

        const dataToSend = {
          ...formData,
          isi: contentTipTap,
          tags: selectTags.map((tag) => tag.id),
          kategori_id: Number(formData.kategori_id),
          user_id: dariList ? Number(formData.user_id) : user.user.id,
        };

        await handleRequest(dataToSend);
    }

    const handleRequest = async (data: typeof formData) => {
      if(modalType == "create") {
        const schema = artikelValidationCreate(validKategori, validUser, validTag);
        const result = schema.safeParse(data);

        if(!result.success) {
          const errors = result.error.flatten().fieldErrors;
          setErrorMessages(Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, value?.[0] || ""])));
          setLoadingSave(false);
          return;
        }

        const image = await Helper.convertImageToBase64(result.data.banner);      
        const dataSend = {
          judul_artikel: result.data.judul_artikel,
          isi: result.data.isi,
          kategori_id: result.data.kategori_id,
          user_id: result.data.user_id,
          tags: result.data.tags,
          banner: image,
          token: token
        }

        const fetchArtikelCreate = await createArtikel(dataSend);

        if(fetchArtikelCreate.errors !== undefined || fetchArtikelCreate.status == false || fetchArtikelCreate.success == false) {
          setErrorForm(fetchArtikelCreate.message || fetchArtikelCreate.pesan || "Error Tidak Diketahui");
          setLoadingSave(false);
          return;
        }

        setTimeout(() => {
          setSukses(fetchArtikelCreate.pesan);
          setAlertCountdown(timeDeleteAlert / 1000);
          setTimeout(() => {
            setSukses("");
            setAlertCountdown(0);
          }, timeDeleteAlert);
        }, 100)

      } else if(modalType == "update") {
        const schema = artikelValidationEdit(validKategori, validUser, validTag);
        const result = schema.safeParse(data);

        if(!result.success) {
          const errors = result.error.flatten().fieldErrors;
          setErrorMessages(Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, value?.[0] || ""])));
          setLoadingSave(false);
          return;
        }

        if(idArtikel == undefined) {
          setTimeout(() => {
            setSukses("");
            setAlertCountdown(0);
          }, timeDeleteAlert);
          setLoadingSave(false);
          onClose();
          return;
        }

        const image = result.data.banner ? await Helper.convertImageToBase64(result.data.banner) : null;      
        const dataSend = {
          judul_artikel: result.data.judul_artikel,
          isi: result.data.isi,
          kategori_id: result.data.kategori_id,
          user_id: result.data.user_id,
          tags: result.data.tags,
          banner: image,
          token: token,
          id: idArtikel
        }

        const fetcheditArtikel = await editArtikel(dataSend);

        if(fetcheditArtikel.errors !== undefined || fetcheditArtikel.status == false || fetcheditArtikel.success == false) {
          setErrorForm(fetcheditArtikel.message || fetcheditArtikel.pesan || "Error Tidak Diketahui");
          setLoadingSave(false);
          return;
        }

        setTimeout(() => {
          setSukses(fetcheditArtikel.pesan);
          setAlertCountdown(timeDeleteAlert / 1000);
          setTimeout(() => {
            setSukses("");
            setAlertCountdown(0);
          }, timeDeleteAlert);
        }, 100)

      } else {
        console.error("Mode Tidak Diketahui");
      }
      
      setLoadingSave(false);
      onClose() // Tutup modal setelah submit
      setTimeout(() => {
        onSaveReload && onSaveReload();
      }, 100)

    }
    
  return (
    <Dialog open={openModal} onOpenChange={(isOpen) => {
        if(!isOpen) onClose()
    }}>

    <DialogContent className="text-gray-100 bg-black/90 max-w-[1000px]" style={{borderRadius: "10px"}}>
        <DialogHeader>
        <DialogTitle>{modalType == "create" ? "Tambah Artikel Baru" : "Edit Data Artikel"}</DialogTitle>
        </DialogHeader>

        {/* Form */}
        {loadingForm ? (
          <div className="flex w-full h-full items-center justify-center"><LoadingText text="Ambil Data Form"/></div>
        ) : (
          <form onSubmit={handleSubmitForm} className="">
            {errorForm != "" && 
            <div className="bg-red-400/30 w-full h-7 text-sm mb-2 flex p-2 items-center" style={{
                borderRadius: "5px"
            }}>{errorForm}</div>}
            <div className="h-[420px] overflow-y-auto space-y-4 px-1">
                {/* Nama */}
                <div>
                  <label className="block text-sm font-medium">Judul Artikel</label>
                  <input
                      type="text"
                      name="judul_artikel"
                      value={formData.judul_artikel}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md bg-gray-800 text-white"
                      autoComplete="off"
                      style={{
                      borderRadius: "5px"
                      }}
                  />
                  {errorMessages.judul_artikel && <p className="text-red-400 mt-1 text-sm">{errorMessages.judul_artikel}</p>}
                </div>

                {/* Kategori Select */}
                <div>
                  <label className="block text-sm font-medium">Kategori Artikel</label>
                  <select
                      name="kategori_id"
                      value={formData.kategori_id}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md bg-gray-800 text-white"
                      style={{
                      borderRadius: "5px"
                      }}
                  >
                      <option value="">{loadingKategori ? "Memuat..." : "Pilih Kategori"}</option>
                      {kategoriSelect && kategoriSelect.map((kategori, index) => (
                      <option key={index} value={kategori.id}>
                          {kategori.kategori}
                      </option>
                      ))}
                  </select>
                  {errorMessages.kategori_id && <p className="text-red-400 mt-1 text-sm">{errorMessages.kategori_id}</p>}
                </div>

                {/* User Select */}
                {dariList && (
                  <div>
                    <label className="block text-sm font-medium">Pembuat</label>
                    <select
                        name="user_id"
                        value={formData.user_id}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md bg-gray-800 text-white"
                        style={{
                        borderRadius: "5px"
                        }}
                    >
                        <option value="">{loadingUser ? "Memuat..." : "Pilih User"}</option>
                        {userSelect && userSelect.map((user, index) => (
                        <option key={index} value={user.id}>
                            {user.name}
                        </option>
                        ))}
                    </select>
                    {errorMessages.user_id && <p className="text-red-400 mt-1 text-sm">{errorMessages.user_id}</p>}
                  </div>
                )}

                <div className="w-full">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectTags.map((tag, index) => (
                      <span key={index} className="bg-gray-100/10 text-white px-3 py-1 rounded-lg flex items-center" style={{borderRadius: "5px"}}>{tag.tag} <button className="ml-2 text-sm font-bold" onClick={() => removeTag(tag.id)}><X/></button></span>
                    ))}
                  </div>

                  <input type="text" placeholder="Pilih Tag..." value={searchTags} onChange={(e) => setSearchTags(e.target.value)} className="bg-gray-800 w-full px-3 py-2 border border-gray-300 rounded-lg" style={{borderRadius: "5px"}}/>

                  {loadingSearchTags && <p className="text-gray-500 mt-2">Memuat...</p>}

                  {errorSearchTags && <p className="text-red-500 mt-2">{errorSearchTags}</p>}

                  {!loadingSearchTags && searchTags && (
                    <ul className="border border-gray-300 rounded-lg mt-2 bg-gray-900/20" style={{borderRadius: "10px"}}>
                      {filterTags.length > 0 ? (
                        filterTags.map((tag) => (
                          <li key={tag.id} className="p-2 cursor-pointer hover:bg-gray-100/10" onClick={() => addTagSelect(tag)}>{tag.tag}</li>
                        ))
                      ) : (
                        <li className="p-2 text-gray-500">Tag tidak ditemukan</li>
                      )}
                    </ul>
                  )}
                  {errorMessages.tags && <p className="text-red-400 mt-1 text-sm">{errorMessages.tags}</p>}
                </div>

                <div className="border p-3" style={{borderRadius: "10px"}}>
                  <div className="control-group mb-2">
                    <div className="button-group flex gap-2">
                      <button className={`border px-2 py-1 rounded transition ${editor?.isActive('heading', {level:1}) ? 'bg-blue-700' : 'hover:bg-gray-800/70'}`} onClick={(e) => {
                        e.preventDefault() 
                        if(!editor) return;
                        editor?.chain().focus().toggleHeading({level: 1}).run()}}><Heading1 size={18}/></button>
                      <button className={`border px-2 py-1 rounded transition ${editor?.isActive('heading', {level:2}) ? 'bg-blue-700' : 'hover:bg-gray-800/70'}`} onClick={(e) => {
                        e.preventDefault() 
                        if(!editor) return;
                        editor?.chain().focus().toggleHeading({level: 2}).run()}}><Heading2 size={18}/></button>
                      <button className={`border px-2 py-1 rounded transition ${editor?.isActive('heading', {level:3}) ? 'bg-blue-700' : 'hover:bg-gray-800/70'}`} onClick={(e) => {
                        e.preventDefault() 
                        if(!editor) return;
                        editor?.chain().focus().toggleHeading({level: 3}).run()}}><Heading3 size={18}/></button>
                      <button className={`border px-2 py-1 rounded transition ${editor?.isActive('heading', {level:4}) ? 'bg-blue-700' : 'hover:bg-gray-800/70'}`} onClick={(e) => {
                        e.preventDefault() 
                        if(!editor) return;
                        editor?.chain().focus().toggleHeading({level: 4}).run()}}><Heading4 size={18}/></button>
                      <button className={`border px-2 py-1 rounded transition ${editor?.isActive('heading', {level:5}) ? 'bg-blue-700' : 'hover:bg-gray-800/70'}`} onClick={(e) => {
                        e.preventDefault() 
                        if(!editor) return;
                        editor?.chain().focus().toggleHeading({level: 5}).run()}}><Heading5 size={18}/></button>
                      <button className={`border px-2 py-1 rounded transition ${editor?.isActive('heading', {level:6}) ? 'bg-blue-700' : 'hover:bg-gray-800/70'}`} onClick={(e) => {
                        e.preventDefault() 
                        if(!editor) return;
                        editor?.chain().focus().toggleHeading({level: 6}).run()}}><Heading6 size={18}/></button>

                      {/* <button className={`border px-2 rounded transition ${editor?.isActive('paragraph') ? 'bg-blue-700' : 'hover:bg-gray-800/70'}`} onClick={(e) => {
                        e.preventDefault() 
                        if(!editor) return;
                        editor?.chain().focus().setParagraph().run()}}><Heading3 size={18}/></button> */}
                      <button className={`border px-2 py-1 rounded transition ${editor?.isActive('bold') ? 'bg-blue-700' : 'hover:bg-gray-800/70'}`} onClick={(e) => {
                        e.preventDefault() 
                        if(!editor) return;
                        editor?.chain().focus().toggleBold().run()}}><Bold size={18}/></button>
                      <button className={`border px-2 py-1 rounded transition ${editor?.isActive('italic') ? 'bg-blue-700' : 'hover:bg-gray-800/70'}`} onClick={(e) => {
                        e.preventDefault() 
                        if(!editor) return;
                        editor?.chain().focus().toggleItalic().run()}}><Italic size={18}/></button>
                      <button className={`border px-2 py-1 rounded transition ${editor?.isActive('strike') ? 'bg-blue-700' : 'hover:bg-gray-800/70'}`} onClick={(e) => {
                        e.preventDefault() 
                        if(!editor) return;
                        editor?.chain().focus().toggleStrike().run()}}><Strikethrough size={18}/></button>
                      <button className={`border px-2 py-1 rounded transition ${editor?.isActive({textAlign: 'left'}) ? 'bg-blue-700' : 'hover:bg-gray-800/70'}`} onClick={(e) => {
                        e.preventDefault() 
                        if(!editor) return;
                        editor?.chain().focus().setTextAlign('left').run()}}><AlignLeft size={18}/></button>
                      <button className={`border px-2 py-1 rounded transition ${editor?.isActive({textAlign: 'center'}) ? 'bg-blue-700' : 'hover:bg-gray-800/70'}`} onClick={(e) => {
                        e.preventDefault() 
                        if(!editor) return;
                        editor?.chain().focus().setTextAlign('center').run()}}><AlignCenter size={18}/></button>
                      <button className={`border px-2 py-1 rounded transition ${editor?.isActive({textAlign: 'right'}) ? 'bg-blue-700' : 'hover:bg-gray-800/70'}`} onClick={(e) => {
                        e.preventDefault() 
                        if(!editor) return;
                        editor?.chain().focus().setTextAlign('right').run()}}><AlignRight size={18}/></button>
                      <button className={`border px-2 py-1 rounded transition ${editor?.isActive({textAlign: 'justify'}) ? 'bg-blue-700' : 'hover:bg-gray-800/70'}`} onClick={(e) => {
                        e.preventDefault() 
                        if(!editor) return;
                        editor?.chain().focus().setTextAlign('justify').run()}}><AlignJustify size={18}/></button>
                      <button className={`border px-2 py-1 rounded transition ${editor?.isActive('highlight') ? 'bg-blue-700' : 'hover:bg-gray-800/70'}`} onClick={(e) => {
                        e.preventDefault() 
                        if(!editor) return;
                        editor?.chain().focus().toggleHighlight().run()}}><Highlighter size={18}/></button>
                    </div>
                  </div>
                  <EditorContent editor={editor} style={{borderRadius: "5px"}}></EditorContent>
                  {errorMessages.isi && <p className="text-red-400 mt-1 text-sm">{errorMessages.isi}</p>}
                </div>
                

                {/* Upload Foto Profil */}
                <div>
                  <label className="block text-sm font-medium">Banner Artikel</label>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="mt-1 bg-transparent" style={{
                      borderRadius: "5px"
                      }} />
                  {formData.previewBanner && (
                      <img src={formData.previewBanner} alt="Preview" className="mt-2 w-[300px] h-32 object-cover rounded-md" style={{
                      borderRadius: "5px"
                      }} />
                  )}
                  {errorMessages.banner && <p className="text-red-400 mt-1 text-sm">{errorMessages.banner}</p>}
                </div>
            </div>

            {/* Footer */}
            <DialogFooter className="flex justify-between">
                <DialogClose asChild>
                <Button variant="outline" className="rounded bg-gray-700 hover:bg-gray-800 transition">
                    Batal
                </Button>
                </DialogClose>
                <Button type="submit" disabled={loadingSave} className="rounded bg-blue-700 hover:bg-blue-800 transition">
                {loadingSave && <LoadingCircle/>} Simpan
                </Button>
            </DialogFooter>
            </form>
        )}
        
    </DialogContent>
    </Dialog>
  )
}

export default ArtikelProp;
