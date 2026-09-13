/**
 * Tipos do schema Supabase, escritos à mão em espelho às migrations em
 * `supabase/migrations`. Se o schema mudar, atualize este arquivo (ou gere
 * com `supabase gen types typescript` quando houver um projeto linkado).
 *
 * O formato de cada tabela (`Row`/`Insert`/`Update`/`Relationships`) segue
 * o `GenericTable` exigido por @supabase/postgrest-js para que a
 * inferência de tipos de `.from(...).select(...)` funcione corretamente —
 * omitir `Relationships` faz o TypeScript cair silenciosamente em `never`.
 */

export type StudentStatus = "aluno" | "ex-aluno";
export type PostCategory = "aviso" | "evento" | "conquista" | "cronica";

type StudentRow = {
  id: string;
  slug: string;
  name: string;
  school_year: number | null;
  role_title: string | null;
  status: StudentStatus;
  short_bio: string | null;
  biography: string | null;
  interests: string[] | null;
  narrative_skills: string[] | null;
  portrait_path: string | null;
  published: boolean;
  highlight_order: number | null;
  created_at: string;
  updated_at: string;
};

type PostRow = {
  id: string;
  slug: string;
  category: PostCategory;
  title: string;
  excerpt: string | null;
  body: string;
  cover_path: string | null;
  author_label: string | null;
  event_date: string | null;
  published: boolean;
  published_at: string | null;
  highlight_order: number | null;
  created_at: string;
  updated_at: string;
};

type GalleryItemRow = {
  id: string;
  title: string;
  caption: string | null;
  image_path: string;
  image_width: number | null;
  image_height: number | null;
  taken_at: string | null;
  published: boolean;
  highlight_order: number | null;
  created_at: string;
  updated_at: string;
};

type GalleryItemStudentRow = {
  gallery_item_id: string;
  student_id: string;
};

type SiteContentRow = {
  key: string;
  title: string | null;
  body: string | null;
  published: boolean;
  updated_at: string;
};

type AdminUserRow = {
  user_id: string;
  display_name: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      students: {
        Row: StudentRow;
        Insert: Partial<StudentRow> & { slug: string; name: string };
        Update: Partial<StudentRow>;
        Relationships: [];
      };
      posts: {
        Row: PostRow;
        Insert: Partial<PostRow> & { slug: string; title: string; category: PostCategory; body: string };
        Update: Partial<PostRow>;
        Relationships: [];
      };
      gallery_items: {
        Row: GalleryItemRow;
        Insert: Partial<GalleryItemRow> & { title: string; image_path: string };
        Update: Partial<GalleryItemRow>;
        Relationships: [];
      };
      gallery_item_students: {
        Row: GalleryItemStudentRow;
        Insert: GalleryItemStudentRow;
        Update: Partial<GalleryItemStudentRow>;
        Relationships: [
          {
            foreignKeyName: "gallery_item_students_gallery_item_id_fkey";
            columns: ["gallery_item_id"];
            isOneToOne: false;
            referencedRelation: "gallery_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "gallery_item_students_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      site_content: {
        Row: SiteContentRow;
        Insert: Partial<SiteContentRow> & { key: string };
        Update: Partial<SiteContentRow>;
        Relationships: [];
      };
      admin_users: {
        Row: AdminUserRow;
        Insert: Partial<AdminUserRow> & { user_id: string };
        Update: Partial<AdminUserRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
