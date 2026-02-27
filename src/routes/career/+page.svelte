<script lang="ts">
  import Content from "$lib/components/Base/AppContent.svelte";
  import Link from "$lib/components/Base/AppLink.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Experience from "$lib/components/Experience.svelte";

  import { ctw, jmv, senai, spiry, uemg } from "$lib/data/experiences";
  import { m } from "$lib/paraglide/messages";
</script>

<Content page>
  <Title>{m.career_work_title()}</Title>
  <div class="my-6">
    <Experience experience={ctw}>
      <li>{m.career_ctw_1()}</li>
      <li>{m.career_ctw_2()}</li>
      <li>{m.career_ctw_3()}</li>
      <li>{m.career_ctw_4()}</li>
      <li>{m.career_ctw_5()}</li>
      <li><b>{m.career_ctw_tools_label()}</b> {m.career_ctw_tools()}</li>
      <li><b>{m.career_ctw_stack_label()}</b> {m.career_ctw_stack()}</li>
    </Experience>
    <Experience experience={jmv}>
      <li>
        {m.career_jmv_1()}
        (<Link to="https://nochalks.com/">Nochalks</Link>)
      </li>

      <li>{m.career_jmv_2()}</li>
      <li>{m.career_jmv_3()}</li>
      <li><b>{m.career_jmv_tools_label()}</b> {m.career_jmv_tools()}</li>
      <li><b>{m.career_jmv_stack_label()}</b> {m.career_jmv_stack()}</li>
    </Experience>
    <Experience experience={spiry}>
      <li>
        {m.career_spiry_1()}
        <Link to="https://koinzaar.com/">Koinzaar</Link>
      </li>
      <li><b>{m.career_spiry_stack_label()}</b> {m.career_spiry_stack()}</li>
    </Experience>
  </div>
  <Title>{m.career_education_title()}</Title>
  <div class="my-6">
    <Experience experience={senai}>
      <li>
        {m.career_senai_1()}
        <ul>
          <li>C++, C#, SQL, HTML CSS, JS JQuery and Java</li>
        </ul>
      </li>
    </Experience>
    <Experience experience={uemg}>
      <li>{m.career_uemg_1()}</li>
      <li>{m.career_uemg_2()}</li>
      <li>{m.career_uemg_3()}</li>
      <li>{m.career_uemg_4()}</li>
    </Experience>
  </div>
</Content>
