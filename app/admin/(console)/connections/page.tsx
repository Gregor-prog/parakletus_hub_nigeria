import Link from "next/link";
import type { Metadata } from "next";
import { requireSession } from "@/lib/admin/dal";
import { connectionReport } from "@/lib/admin/backends";
import { PageHead } from "../../_components/ui";

export const metadata: Metadata = { title: "Connections" };

export default async function ConnectionsPage() {
  await requireSession();
  const rows = connectionReport();
  const done = rows.filter((r) => r.urlValid).length;

  return (
    <>
      <PageHead
        eyebrow="Connections"
        title={
          <>
            Backend <span className="serif-italic">wiring.</span>
          </>
        }
        lede={`${done} of ${rows.length} services configured. URLs and tokens are read from the server environment and never sent to the browser.`}
      />

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Service</th>
              <th scope="col">Environment variable</th>
              <th scope="col">URL</th>
              <th scope="col">Token</th>
              <th scope="col">Health path</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.product}-${r.service}`}>
                <th scope="row">
                  <Link href={`/products/${r.product}`} className="table__link">
                    {r.productName}
                  </Link>
                </th>
                <td>{r.serviceLabel}</td>
                <td className="mono">{r.envPrefix}_API_URL</td>
                <td>
                  {r.urlValid ? (
                    <span className="check is-on">{r.host}</span>
                  ) : r.urlSet ? (
                    <span className="check is-bad">{r.urlProblem}</span>
                  ) : (
                    <span className="check">Not set</span>
                  )}
                </td>
                <td>
                  <span className={`check ${r.tokenSet ? "is-on" : ""}`}>{r.tokenSet ? "Set" : "None"}</span>
                </td>
                <td className="mono muted">{r.healthPath}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="howto" aria-labelledby="howto-h">
        <h2 id="howto-h" className="block-title">
          Connecting a backend
        </h2>
        <ol className="howto__steps">
          <li>
            <strong>Set the URL.</strong> Add <code>PREFIX_API_URL</code> to <code>.env.local</code> locally, or to the host&apos;s
            environment in production. Include any path prefix, e.g. <code>https://api.sabinote.pln.ng/api/v1</code>. Production
            requires <code>https</code>.
          </li>
          <li>
            <strong>Add the console token.</strong> Generate one random value (<code>openssl rand -base64 48</code>) and set it
            twice: as <code>ADMIN_CONSOLE_TOKEN</code> in the backend&apos;s Azure settings, and as <code>PREFIX_API_TOKEN</code>{" "}
            here. It&apos;s sent in the <code>x-console-token</code> header and only opens that backend&apos;s read-only{" "}
            <code>/console/*</code> routes.
          </li>
          <li>
            <strong>Restart</strong> the app so it picks up the new environment. The service turns green here once its health
            path answers.
          </li>
          <li>
            <strong>Call it.</strong> Server code uses <code>serviceFetch(&quot;sabinote&quot;, &quot;api&quot;, &quot;/console/users&quot;)</code>. Client
            code calls <code>/api/admin/proxy/sabinote/api/console/users</code>, which checks the admin session and adds the token
            on the server.
          </li>
        </ol>
      </section>
    </>
  );
}
