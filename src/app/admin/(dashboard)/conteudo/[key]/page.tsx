import { SiteContentForm } from "@/components/admin/site-content-form";
import { getAdminSiteContentByKey } from "@/lib/admin/queries";
import { KNOWN_SITE_CONTENT_KEYS } from "@/lib/validations/site-content";
import { upsertSiteContent } from "../actions";

export default async function EditSiteContentPage(props: PageProps<"/admin/conteudo/[key]">) {
  const { key } = await props.params;
  const content = await getAdminSiteContentByKey(key);
  const known = KNOWN_SITE_CONTENT_KEYS.find((k) => k.key === key);

  const boundAction = upsertSiteContent.bind(null, key);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ivory">{known?.label ?? key}</h1>
        <p className="font-sans text-xs text-muted-foreground">Chave: {key}</p>
      </div>
      <SiteContentForm key={key} content={content} action={boundAction} />
    </div>
  );
}
