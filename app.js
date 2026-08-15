// =========================================================
// app.js - Lógica principal de la aplicación
// =========================================================

const CATEGORIAS = [
  "Alimentación",
  "Transporte",
  "Servicios",
  "Salud",
  "Educación",
  "Entretenimiento",
  "Otros",
];

let familiaId = null;
let editando = false;

// ---------- MENÚ HAMBURGUESA ----------
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navMenu = document.getElementById("navMenu");

if (hamburgerBtn && navMenu) {
  hamburgerBtn.addEventListener("click", () => {
    hamburgerBtn.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  navMenu.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburgerBtn.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });
}

// ---------- SALIR / CERRAR SESIÓN ----------
const btnSalir = document.getElementById("btnSalir");

if (btnSalir) {
  btnSalir.addEventListener("click", () => {
    mostrarConfirmacionSalida();
  });
}

function mostrarConfirmacionSalida() {
  // Evita crear dos ventanas
  if (document.getElementById("modalSalir")) return;

  const modal = document.createElement("div");

  modal.id = "modalSalir";
  modal.className = "modal-salida";

  modal.innerHTML = `
    <div class="modal-salida__contenido">

      <div class="modal-salida__icono">
        🚪
      </div>

      <h2>¿Quieres cerrar sesión?</h2>

      <p>
        Tu sesión se cerrará y volverás a la pantalla de inicio.
      </p>

      <div class="modal-salida__acciones">

        <button
          type="button"
          id="btnConfirmarSalida"
          class="modal-salida__confirmar">
          Sí, salir
        </button>

        <button
          type="button"
          id="btnCancelarSalida"
          class="modal-salida__cancelar">
          Cancelar
        </button>

      </div>

    </div>
  `;

  document.body.appendChild(modal);

  // Botón confirmar
  document
    .getElementById("btnConfirmarSalida")
    .addEventListener("click", async () => {

      const boton = document.getElementById("btnConfirmarSalida");

      boton.disabled = true;
      boton.textContent = "Saliendo...";

      await cerrarSesion();
    });

  // Botón cancelar
  document
    .getElementById("btnCancelarSalida")
    .addEventListener("click", () => {
      cerrarModalSalida();
    });

  // También permite cerrar haciendo clic fuera del cuadro
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      cerrarModalSalida();
    }
  });

  // Permite cerrar con la tecla Escape
  document.addEventListener("keydown", cerrarConEscape);
}

function cerrarModalSalida() {
  const modal = document.getElementById("modalSalir");

  if (modal) {
    modal.remove();
  }

  document.removeEventListener("keydown", cerrarConEscape);
}

function cerrarConEscape(e) {
  if (e.key === "Escape") {
    cerrarModalSalida();
  }
}


// ---------- FAMILIA (foto + nombre) ----------
async function cargarFamilia() {
  const { data, error } = await supabase
    .from("familia")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Error cargando familia:", error.message);
    return;
  }

  if (data.length === 0) {
    const { data: nueva, error: errorInsert } = await supabase
      .from("familia")
      .insert([{ nombre_familia: "Mi Familia" }])
      .select();

    if (errorInsert) {
      console.error("Error creando familia:", errorInsert.message);
      return;
    }

    familiaId = nueva[0].id;
    pintarFamilia(nueva[0]);
  } else {
    familiaId = data[0].id;
    pintarFamilia(data[0]);
  }
}

function pintarFamilia(familia) {
  document.getElementById("nombreFamilia").textContent =
    familia.nombre_familia || "Mi Familia";

  const img = document.getElementById("fotoFamiliar");

  img.src =
    familia.foto_url ||
    "https://placehold.co/90x90?text=Foto";
}

const inputFoto = document.getElementById("inputFoto");

if (inputFoto) {
  inputFoto.addEventListener("change", async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const nombreArchivo =
      `familia_${familiaId}_${Date.now()}.` +
      `${file.name.split(".").pop()}`;

    const { error: uploadError } = await supabase.storage
      .from("fotos-familia")
      .upload(nombreArchivo, file, {
        upsert: true,
      });

    if (uploadError) {
      mostrarToast(
        "Error al subir la foto: " + uploadError.message,
        "error"
      );
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("fotos-familia")
      .getPublicUrl(nombreArchivo);

    const foto_url = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from("familia")
      .update({ foto_url })
      .eq("id", familiaId);

    if (updateError) {
      mostrarToast(
        "Error al guardar la foto: " + updateError.message,
        "error"
      );
      return;
    }

    document.getElementById("fotoFamiliar").src = foto_url;

    mostrarToast(
      "Foto actualizada correctamente",
      "exito"
    );
  });
}


// ---------- CRUD GASTOS ----------
const form = document.getElementById("formGasto");
const btnCancelar = document.getElementById("btnCancelar");

if (form) {

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ---------- Obtener usuario ----------
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      mostrarToast(
        "No hay una sesión activa. Inicia sesión nuevamente.",
        "error"
      );
      return;
    }

    const gasto = {
      descripcion: document
        .getElementById("descripcion")
        .value
        .trim(),

      monto: parseFloat(
        document.getElementById("monto").value
      ),

      categoria:
        document.getElementById("categoria").value,

      fecha:
        document.getElementById("fecha").value,

      usuario_id: user.id,
    };

    if (editando) {

      const id =
        document.getElementById("gastoId").value;

      const { error } = await supabase
        .from("gastos")
        .update(gasto)
        .eq("id", id);

      if (error) {
        mostrarToast(
          "Error al actualizar: " + error.message,
          "error"
        );
        return;
      }

      mostrarToast(
        "Gasto actualizado correctamente",
        "exito"
      );

    } else {

      const { error } = await supabase
        .from("gastos")
        .insert([gasto]);

      if (error) {
        mostrarToast(
          "Error al guardar: " + error.message,
          "error"
        );
        return;
      }

      mostrarToast(
        "Gasto guardado correctamente",
        "exito"
      );
    }

    resetForm();
    await cargarGastos();
  });

}

if (btnCancelar) {
  btnCancelar.addEventListener("click", resetForm);
}


function resetForm() {

  if (!form) return;

  form.reset();

  document.getElementById("gastoId").value = "";

  document.getElementById("fecha").valueAsDate =
    new Date();

  editando = false;

  btnCancelar.hidden = true;

  document.getElementById("btnGuardar").textContent =
    "Guardar gasto";
}


// ---------- CARGAR GASTOS ----------
async function cargarGastos() {

  const { data, error } = await supabase
    .from("gastos")
    .select("*")
    .order("fecha", {
      ascending: false,
    });

  if (error) {

    console.error(
      "Error cargando gastos:",
      error.message
    );

    mostrarToast(
      "Error cargando gastos: " + error.message,
      "error"
    );

    return;
  }

  pintarTabla(data);
  pintarStats(data);
  pintarCategorias(data);
}


// ---------- TABLA ----------
function pintarTabla(gastos) {

  const tbody =
    document.getElementById("tablaGastosBody");

  if (!tbody) return;

  tbody.innerHTML = "";

  gastos.forEach((g) => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td data-label="Descripción">
        ${g.descripcion}
      </td>

      <td data-label="Categoría">
        ${g.categoria}
      </td>

      <td data-label="Monto">
        Bs. ${Number(g.monto).toFixed(2)}
      </td>

      <td data-label="Fecha">
        ${g.fecha}
      </td>

      <td data-label="Acciones">

        <div class="acciones">

          <button
            class="btn btn--small btn--edit"
            onclick="editarGasto('${g.id}')">

            Editar

          </button>

          <button
            class="btn btn--small btn--delete"
            onclick="eliminarGasto('${g.id}')">

            Eliminar

          </button>

        </div>

      </td>
    `;

    tbody.appendChild(tr);
  });
}


// ---------- EDITAR GASTO ----------
window.editarGasto = async function (id) {

  const { data, error } = await supabase
    .from("gastos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {

    mostrarToast(
      "Error: " + error.message,
      "error"
    );

    return;
  }

  document.getElementById("gastoId").value =
    data.id;

  document.getElementById("descripcion").value =
    data.descripcion;

  document.getElementById("monto").value =
    data.monto;

  document.getElementById("categoria").value =
    data.categoria;

  document.getElementById("fecha").value =
    data.fecha;

  editando = true;

  btnCancelar.hidden = false;

  document.getElementById("btnGuardar").textContent =
    "Actualizar gasto";

  document
    .getElementById("nuevo-gasto")
    .scrollIntoView({
      behavior: "smooth",
    });
};


// ---------- ELIMINAR GASTO ----------
window.eliminarGasto = async function (id) {

  if (
    !confirm(
      "¿Seguro que deseas eliminar este gasto?"
    )
  ) {
    return;
  }

  const { error } = await supabase
    .from("gastos")
    .delete()
    .eq("id", id);

  if (error) {

    mostrarToast(
      "Error al eliminar: " + error.message,
      "error"
    );

    return;
  }

  mostrarToast(
    "Gasto eliminado correctamente",
    "exito"
  );

  await cargarGastos();
};


// ---------- DASHBOARD: ESTADÍSTICAS ----------
function pintarStats(gastos) {

  const total = gastos.reduce(
    (sum, g) => sum + Number(g.monto),
    0
  );

  const hoy = new Date();

  const mesActual =
    hoy.getMonth();

  const anioActual =
    hoy.getFullYear();

  const totalMes = gastos
    .filter((g) => {

      const f = new Date(g.fecha);

      return (
        f.getMonth() === mesActual &&
        f.getFullYear() === anioActual
      );

    })
    .reduce(
      (sum, g) => sum + Number(g.monto),
      0
    );

  const totalesPorCategoria = {};

  gastos.forEach((g) => {

    totalesPorCategoria[g.categoria] =
      (totalesPorCategoria[g.categoria] || 0) +
      Number(g.monto);

  });

  let categoriaTop = "-";
  let maxValor = 0;

  for (const [
    cat,
    valor,
  ] of Object.entries(totalesPorCategoria)) {

    if (valor > maxValor) {

      maxValor = valor;
      categoriaTop = cat;

    }
  }

  document.getElementById(
    "statTotal"
  ).textContent =
    `Bs. ${total.toFixed(2)}`;

  document.getElementById(
    "statMes"
  ).textContent =
    `Bs. ${totalMes.toFixed(2)}`;

  document.getElementById(
    "statCantidad"
  ).textContent =
    gastos.length;

  document.getElementById(
    "statCategoriaTop"
  ).textContent =
    categoriaTop;
}


// ---------- GASTOS POR CATEGORÍA ----------
function pintarCategorias(gastos) {

  const contenedor =
    document.getElementById(
      "categoriasContainer"
    );

  if (!contenedor) return;

  contenedor.innerHTML = "";

  const total = gastos.reduce(
    (sum, g) => sum + Number(g.monto),
    0
  );

  const totalesPorCategoria = {};

  CATEGORIAS.forEach(
    (cat) => {
      totalesPorCategoria[cat] = 0;
    }
  );

  gastos.forEach((g) => {

    totalesPorCategoria[g.categoria] =
      (totalesPorCategoria[g.categoria] || 0) +
      Number(g.monto);

  });

  Object.entries(
    totalesPorCategoria
  ).forEach(([cat, valor]) => {

    const porcentaje =
      total > 0
        ? (valor / total) * 100
        : 0;

    const bar =
      document.createElement("div");

    bar.className =
      "categoria-bar";

    bar.innerHTML = `

      <div class="categoria-bar__label">

        <span>
          ${cat}
        </span>

        <span>
          Bs. ${valor.toFixed(2)}
        </span>

      </div>

      <div class="categoria-bar__track">

        <div
          class="categoria-bar__fill"
          style="width: ${porcentaje}%">
        </div>

      </div>

    `;

    contenedor.appendChild(bar);
  });
}


// ---------- INICIO ----------
const campoFecha = document.getElementById("fecha");

if (campoFecha) {
  campoFecha.valueAsDate = new Date();
}

cargarFamilia();
cargarGastos();
