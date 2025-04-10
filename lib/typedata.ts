export type ArtikelType = {
  id: number,
  judul_artikel: string,
  isi: string,
  kategori_id: number,
  user_id: number,
  created_at: string,
  updated_at: string,
  banner: string,
  user?: UserType,
  tags?: TagsType[],
  komentars?: KomentarType[],
  kategori?: KategoriType
}

export type UserType = {
    id: number,
    name: string,
    email: string, 
    email_verified_at: string | null, 
    role_id: number,
    created_at: string,
    updated_at: string,
    profil: string,
    role?: RoleType
}

export type UserTypeOnlyName = {
    id: number,
    name: string
}

export type TagsType = {
    id: number,
    tag: string,
    created_at: string,
    updated_at: string,
    artikels: ArtikelType[]
}

export type KomentarType = {
    id: number,
    komentar: string,
    artikel_id: number,
    created_at: string,
    updated_at: string,
    user_id: number
}

export type KategoriType = {
    id: number,
    kategori: string,
    created_at: string,
    updated_at: string,
    artikels?: ArtikelType[]
}

export type RoleType = {
    id: number,
    role: string,
    created_at: string,
    updated_at: string
    users?: UserType[]
}

export type UserLogin = {
    user: UserType,
    role: RoleType
}