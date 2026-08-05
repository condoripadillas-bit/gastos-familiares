// =========================================================
// ÚNICO ARCHIVO QUE DEBES EDITAR PARA CONECTAR TU PROYECTO
// =========================================================
// 1. Entra a tu proyecto en https://supabase.com
// 2. Ve a: Project Settings > API
// 3. Copia "Project URL" y pégalo en SUPABASE_URL
// 4. Copia "anon public key" y pégalo en SUPABASE_ANON_KEY
// =========================================================

(function () {
const SUPABASE_URL = "https://teijkpixykgabetgytts.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlaWprcGl4eWtnYWJldGd5dHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MTc2NjAsImV4cCI6MjEwMTA5MzY2MH0.dsSmJavhYH2TC-_J9XZhfzV-6hewVih9vLFModwBcK8";

window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();