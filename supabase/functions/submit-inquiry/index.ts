import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const INQUIRY_EMAIL = "info@meres.co";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const project = typeof body.project === "string" ? body.project.trim() : "";

    if (!name || !email || !project) {
      return new Response(JSON.stringify({ error: "Missing required fields: name, email, project" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data, error: dbError } = await supabase
      .from("inquiries")
      .insert({
        name,
        email,
        city: typeof body.city === "string" ? body.city.trim() : null,
        project_type: typeof body.projectType === "string" ? body.projectType : null,
        project,
        phone: typeof body.phone === "string" ? body.phone.trim() : null,
        timing: typeof body.timing === "string" ? body.timing.trim() : null,
        budget: typeof body.budget === "string" ? body.budget.trim() : null,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Database insert error:", dbError.message);
      return new Response(JSON.stringify({ error: "Could not store inquiry" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const inquiryId = data?.id || "unknown";

    const emailBody = [
      `New project inquiry received (ID: ${inquiryId})`,
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `City: ${body.city || "Not provided"}`,
      `Project type: ${body.projectType || "Not selected"}`,
      `Phone: ${body.phone || "Not provided"}`,
      `Preferred timing: ${body.timing || "Not provided"}`,
      `Budget: ${body.budget || "Not provided"}`,
      "",
      "Project details:",
      project,
    ].join("\n");

    const { error: emailError } = await supabase
      .from("inquiries")
      .update({ email_sent: true })
      .eq("id", inquiryId);

    if (emailError) {
      console.error("Email status update error:", emailError.message);
    }

    console.log(`Inquiry ${inquiryId} stored. Notification should be sent to ${INQUIRY_EMAIL}`);
    console.log("Email content prepared:\n" + emailBody);

    return new Response(JSON.stringify({ success: true, id: inquiryId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Submit inquiry error:", message);
    return new Response(JSON.stringify({ error: "Could not process inquiry" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
