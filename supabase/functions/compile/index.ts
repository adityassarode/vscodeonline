import { compile } from "npm:@cpp-wasm/wasi-compiler@0.9.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();

    if (!code) {
      return new Response(
        JSON.stringify({ error: "No code provided" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const result = await compile(code, {
      std: "c++17",
      optimizationLevel: 0,
      timeout: 10000, // 10 seconds timeout
      memoryLimit: 32, // 32MB memory limit
    });

    return new Response(
      JSON.stringify({
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        stdout: "",
        stderr: `Compilation error: ${error.message}`,
        exitCode: 1
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});