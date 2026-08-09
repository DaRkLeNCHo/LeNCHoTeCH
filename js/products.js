/* =========================================================
   LENCHOTECH
   CATÁLOGO DE PRODUCTOS
========================================================= */

"use strict";


/* =========================================================
   1. RUTAS GENERALES
========================================================= */

const PRODUCT_IMAGE_BASE_PATH = "images/products";

const PRODUCT_PLACEHOLDER_PATH =
    "images/placeholders/product-placeholder.webp";


/* =========================================================
   2. CATÁLOGO
========================================================= */

const products = [

    /* =====================================================
       DISPLAYS
    ===================================================== */

    {
        id: 1,
        name: "LG UltraGear 27GN800-B",
        brand: "LG",
        category: "Displays",
        subcategory: "IPS",
        price: 249.99,
        oldPrice: 299.99,
        stock: 12,
        rating: 4.7,
        reviews: 184,
        featured: true,
        offer: true,
        badge: "Oferta",
        badgeType: "sale",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/displays/lg-ultragear-27gn800-b.webp`,
        description:
            "Monitor gaming IPS de 27 pulgadas con resolución QHD y frecuencia de actualización de 144 Hz.",
        specifications: {
            "Tipo de panel": "IPS",
            "Tamaño": "27 pulgadas",
            "Resolución": "2560 × 1440",
            "Frecuencia": "144 Hz",
            "Tiempo de respuesta": "1 ms",
            "Conexiones": "HDMI y DisplayPort"
        }
    },

    {
        id: 2,
        name: "Samsung Odyssey G5",
        brand: "Samsung",
        category: "Displays",
        subcategory: "VA",
        price: 279.99,
        oldPrice: null,
        stock: 8,
        rating: 4.6,
        reviews: 136,
        featured: true,
        offer: false,
        badge: "Popular",
        badgeType: "hot",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/displays/samsung-odyssey-g5.webp`,
        description:
            "Monitor curvo VA de 27 pulgadas diseñado para videojuegos y contenido multimedia.",
        specifications: {
            "Tipo de panel": "VA",
            "Tamaño": "27 pulgadas",
            "Resolución": "2560 × 1440",
            "Frecuencia": "165 Hz",
            "Curvatura": "1000R",
            "Conexiones": "HDMI y DisplayPort"
        }
    },

    {
        id: 3,
        name: "ASUS VG248QG",
        brand: "ASUS",
        category: "Displays",
        subcategory: "TN",
        price: 189.99,
        oldPrice: 219.99,
        stock: 15,
        rating: 4.5,
        reviews: 242,
        featured: false,
        offer: true,
        badge: "Oferta",
        badgeType: "sale",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/displays/asus-vg248qg.webp`,
        description:
            "Monitor TN de 24 pulgadas con alta frecuencia de actualización y baja latencia.",
        specifications: {
            "Tipo de panel": "TN",
            "Tamaño": "24 pulgadas",
            "Resolución": "1920 × 1080",
            "Frecuencia": "165 Hz",
            "Tiempo de respuesta": "0.5 ms",
            "Conexiones": "HDMI, DisplayPort y DVI"
        }
    },

    {
        id: 4,
        name: "LG UltraGear OLED 27GS95QE",
        brand: "LG",
        category: "Displays",
        subcategory: "OLED",
        price: 799.99,
        oldPrice: 899.99,
        stock: 5,
        rating: 4.9,
        reviews: 87,
        featured: true,
        offer: true,
        badge: "Premium",
        badgeType: "hot",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/displays/lg-ultragear-oled-27gs95qe.webp`,
        description:
            "Monitor OLED QHD de 27 pulgadas con negros profundos y respuesta ultrarrápida.",
        specifications: {
            "Tipo de panel": "OLED",
            "Tamaño": "27 pulgadas",
            "Resolución": "2560 × 1440",
            "Frecuencia": "240 Hz",
            "Tiempo de respuesta": "0.03 ms",
            "HDR": "HDR10"
        }
    },

    {
        id: 5,
        name: "Samsung Odyssey Neo G8",
        brand: "Samsung",
        category: "Displays",
        subcategory: "Mini-LED",
        price: 1099.99,
        oldPrice: 1299.99,
        stock: 3,
        rating: 4.8,
        reviews: 61,
        featured: true,
        offer: true,
        badge: "Premium",
        badgeType: "hot",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/displays/samsung-odyssey-neo-g8.webp`,
        description:
            "Monitor Mini-LED curvo de 32 pulgadas con resolución 4K y 240 Hz.",
        specifications: {
            "Tipo de panel": "Mini-LED",
            "Tamaño": "32 pulgadas",
            "Resolución": "3840 × 2160",
            "Frecuencia": "240 Hz",
            "Curvatura": "1000R",
            "HDR": "Quantum HDR 2000"
        }
    },

    {
        id: 6,
        name: "Dell P2424HT Touch",
        brand: "Dell",
        category: "Displays",
        subcategory: "Touchscreen",
        price: 399.99,
        oldPrice: null,
        stock: 7,
        rating: 4.6,
        reviews: 42,
        featured: false,
        offer: false,
        badge: "Nuevo",
        badgeType: "new",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/displays/dell-p2424ht-touch.webp`,
        description:
            "Monitor táctil IPS de 24 pulgadas con conectividad USB-C y soporte ajustable.",
        specifications: {
            "Tipo de panel": "IPS táctil",
            "Tamaño": "24 pulgadas",
            "Resolución": "1920 × 1080",
            "Puntos táctiles": "10",
            "Conexiones": "USB-C, HDMI y DisplayPort",
            "Altavoces": "Integrados"
        }
    },


    /* =====================================================
       CABLES Y CONECTORES
    ===================================================== */

    {
        id: 7,
        name: "Cable Ethernet Cat6 25 pies",
        brand: "Cable Matters",
        category: "Cables",
        subcategory: "Copper",
        price: 14.99,
        oldPrice: null,
        stock: 40,
        rating: 4.8,
        reviews: 392,
        featured: true,
        offer: false,
        badge: "Popular",
        badgeType: "hot",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/cables/cable-ethernet-cat6-25ft.webp`,
        description:
            "Cable de red de cobre Cat6 para conexiones Gigabit Ethernet.",
        specifications: {
            "Tipo": "Cat6",
            "Longitud": "25 pies",
            "Conector": "RJ45",
            "Velocidad": "Hasta 1 Gbps",
            "Blindaje": "UTP",
            "Color": "Azul"
        }
    },

    {
        id: 8,
        name: "Cable Coaxial RG6 15 pies",
        brand: "GE",
        category: "Cables",
        subcategory: "Coaxial",
        price: 11.99,
        oldPrice: null,
        stock: 31,
        rating: 4.5,
        reviews: 112,
        featured: false,
        offer: false,
        badge: null,
        badgeType: null,
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/cables/cable-coaxial-rg6-15ft.webp`,
        description:
            "Cable coaxial RG6 para televisión, módem de cable y señales satelitales.",
        specifications: {
            "Tipo": "RG6",
            "Longitud": "15 pies",
            "Conector": "F-Type",
            "Impedancia": "75 ohmios",
            "Uso": "TV, cable y satélite",
            "Blindaje": "Doble"
        }
    },

    {
        id: 9,
        name: "Cable de fibra óptica LC a LC",
        brand: "StarTech",
        category: "Cables",
        subcategory: "Fiber",
        price: 22.99,
        oldPrice: 27.99,
        stock: 18,
        rating: 4.7,
        reviews: 78,
        featured: false,
        offer: true,
        badge: "Oferta",
        badgeType: "sale",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/cables/fibra-optica-lc-lc.webp`,
        description:
            "Cable de fibra óptica multimodo para redes de alta velocidad.",
        specifications: {
            "Tipo": "Multimodo OM3",
            "Conectores": "LC a LC",
            "Longitud": "3 metros",
            "Núcleo": "50/125 µm",
            "Velocidad": "Hasta 10 Gbps",
            "Color": "Aqua"
        }
    },

    {
        id: 10,
        name: "Cable USB-C a USB-C 100W",
        brand: "Anker",
        category: "Cables",
        subcategory: "USB",
        price: 19.99,
        oldPrice: 24.99,
        stock: 36,
        rating: 4.9,
        reviews: 511,
        featured: true,
        offer: true,
        badge: "Popular",
        badgeType: "hot",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/cables/anker-usb-c-100w.webp`,
        description:
            "Cable USB-C para carga rápida, transferencia de datos y dispositivos modernos.",
        specifications: {
            "Conector": "USB-C a USB-C",
            "Potencia": "Hasta 100 W",
            "Longitud": "6 pies",
            "Datos": "480 Mbps",
            "Material": "Nylon trenzado",
            "Compatibilidad": "USB Power Delivery"
        }
    },

    {
        id: 11,
        name: "Cable HDMI 2.1 Ultra High Speed",
        brand: "Belkin",
        category: "Cables",
        subcategory: "Video",
        price: 29.99,
        oldPrice: null,
        stock: 29,
        rating: 4.8,
        reviews: 235,
        featured: true,
        offer: false,
        badge: "8K",
        badgeType: "new",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/cables/belkin-hdmi-2-1.webp`,
        description:
            "Cable HDMI 2.1 compatible con video 8K, 4K a 120 Hz y HDR.",
        specifications: {
            "Versión": "HDMI 2.1",
            "Resolución máxima": "8K",
            "Frecuencia": "4K a 120 Hz",
            "Ancho de banda": "48 Gbps",
            "Longitud": "6.6 pies",
            "HDR": "Compatible"
        }
    },

    {
        id: 12,
        name: "Cable SATA III con seguro",
        brand: "Monoprice",
        category: "Cables",
        subcategory: "Storage",
        price: 7.99,
        oldPrice: null,
        stock: 52,
        rating: 4.7,
        reviews: 167,
        featured: false,
        offer: false,
        badge: null,
        badgeType: null,
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/cables/cable-sata-iii.webp`,
        description:
            "Cable SATA III para conectar discos duros y unidades SSD a la placa madre.",
        specifications: {
            "Interfaz": "SATA III",
            "Velocidad": "6 Gbps",
            "Longitud": "18 pulgadas",
            "Seguro": "Sí",
            "Conectores": "Recto a recto",
            "Uso": "HDD y SSD"
        }
    },

    {
        id: 13,
        name: "Adaptador USB-C a HDMI",
        brand: "UGREEN",
        category: "Cables",
        subcategory: "Connectors",
        price: 24.99,
        oldPrice: 29.99,
        stock: 23,
        rating: 4.6,
        reviews: 198,
        featured: false,
        offer: true,
        badge: "Oferta",
        badgeType: "sale",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/cables/ugreen-usb-c-hdmi.webp`,
        description:
            "Adaptador USB-C a HDMI para conectar computadoras y dispositivos compatibles a una pantalla.",
        specifications: {
            "Entrada": "USB-C",
            "Salida": "HDMI",
            "Resolución": "Hasta 4K",
            "Frecuencia": "60 Hz",
            "Plug and Play": "Sí",
            "Material": "Aluminio"
        }
    },


    /* =====================================================
       MEMORIA RAM
    ===================================================== */

    {
        id: 14,
        name: "Corsair Vengeance DDR5 32GB",
        brand: "Corsair",
        category: "RAM",
        subcategory: "DIMM",
        price: 109.99,
        oldPrice: 129.99,
        stock: 17,
        rating: 4.9,
        reviews: 286,
        featured: true,
        offer: true,
        badge: "Oferta",
        badgeType: "sale",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/ram/corsair-vengeance-ddr5-32gb.webp`,
        description:
            "Kit de memoria DDR5 para computadoras de escritorio con alto rendimiento.",
        specifications: {
            "Capacidad": "32 GB",
            "Configuración": "2 × 16 GB",
            "Tipo": "DDR5",
            "Velocidad": "6000 MT/s",
            "Formato": "DIMM",
            "Latencia": "CL36"
        }
    },

    {
        id: 15,
        name: "Crucial DDR4 SODIMM 16GB",
        brand: "Crucial",
        category: "RAM",
        subcategory: "SODIMM",
        price: 39.99,
        oldPrice: null,
        stock: 26,
        rating: 4.8,
        reviews: 314,
        featured: true,
        offer: false,
        badge: "Laptop",
        badgeType: "new",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/ram/crucial-ddr4-sodimm-16gb.webp`,
        description:
            "Módulo de memoria DDR4 SODIMM para laptops y computadoras compactas.",
        specifications: {
            "Capacidad": "16 GB",
            "Tipo": "DDR4",
            "Velocidad": "3200 MT/s",
            "Formato": "SODIMM",
            "Voltaje": "1.2 V",
            "ECC": "No"
        }
    },

    {
        id: 16,
        name: "Kingston Server Premier ECC 32GB",
        brand: "Kingston",
        category: "RAM",
        subcategory: "ECC",
        price: 159.99,
        oldPrice: null,
        stock: 9,
        rating: 4.7,
        reviews: 51,
        featured: false,
        offer: false,
        badge: "Servidor",
        badgeType: "new",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/ram/kingston-server-premier-ecc-32gb.webp`,
        description:
            "Memoria ECC diseñada para servidores y estaciones de trabajo compatibles.",
        specifications: {
            "Capacidad": "32 GB",
            "Tipo": "DDR4 ECC",
            "Velocidad": "3200 MT/s",
            "Formato": "DIMM",
            "Corrección de errores": "ECC",
            "Uso": "Servidor"
        }
    },

    {
        id: 17,
        name: "G.Skill Ripjaws V DDR4 16GB",
        brand: "G.Skill",
        category: "RAM",
        subcategory: "Non-ECC",
        price: 44.99,
        oldPrice: 54.99,
        stock: 22,
        rating: 4.8,
        reviews: 417,
        featured: false,
        offer: true,
        badge: "Oferta",
        badgeType: "sale",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/ram/gskill-ripjaws-v-ddr4-16gb.webp`,
        description:
            "Kit de memoria DDR4 Non-ECC para computadoras de escritorio.",
        specifications: {
            "Capacidad": "16 GB",
            "Configuración": "2 × 8 GB",
            "Tipo": "DDR4",
            "Velocidad": "3600 MT/s",
            "Formato": "DIMM",
            "ECC": "No"
        }
    },


    /* =====================================================
       ALMACENAMIENTO
    ===================================================== */

    {
        id: 18,
        name: "Seagate BarraCuda 2TB",
        brand: "Seagate",
        category: "Storage",
        subcategory: "HDD",
        price: 64.99,
        oldPrice: null,
        stock: 21,
        rating: 4.7,
        reviews: 623,
        featured: true,
        offer: false,
        badge: "Popular",
        badgeType: "hot",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/storage/seagate-barracuda-2tb.webp`,
        description:
            "Disco duro interno de 3.5 pulgadas para almacenamiento general.",
        specifications: {
            "Capacidad": "2 TB",
            "Interfaz": "SATA III",
            "Velocidad": "7200 RPM",
            "Formato": "3.5 pulgadas",
            "Caché": "256 MB",
            "Tipo": "HDD"
        }
    },

    {
        id: 19,
        name: "Samsung 870 EVO 1TB",
        brand: "Samsung",
        category: "Storage",
        subcategory: "SSD SATA",
        price: 89.99,
        oldPrice: 109.99,
        stock: 24,
        rating: 4.9,
        reviews: 912,
        featured: true,
        offer: true,
        badge: "Oferta",
        badgeType: "sale",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/storage/samsung-870-evo-1tb.webp`,
        description:
            "Unidad SSD SATA de 2.5 pulgadas para mejorar el rendimiento de computadoras.",
        specifications: {
            "Capacidad": "1 TB",
            "Interfaz": "SATA III",
            "Lectura": "560 MB/s",
            "Escritura": "530 MB/s",
            "Formato": "2.5 pulgadas",
            "Tipo": "SSD"
        }
    },

    {
        id: 20,
        name: "Samsung 990 Pro 2TB",
        brand: "Samsung",
        category: "Storage",
        subcategory: "SSD NVMe",
        price: 179.99,
        oldPrice: 219.99,
        stock: 14,
        rating: 4.9,
        reviews: 438,
        featured: true,
        offer: true,
        badge: "Alto rendimiento",
        badgeType: "hot",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/storage/samsung-990-pro-2tb.webp`,
        description:
            "Unidad SSD NVMe PCIe 4.0 de alto rendimiento para videojuegos y aplicaciones profesionales.",
        specifications: {
            "Capacidad": "2 TB",
            "Interfaz": "PCIe 4.0 NVMe",
            "Lectura": "7450 MB/s",
            "Escritura": "6900 MB/s",
            "Formato": "M.2 2280",
            "Tipo": "SSD NVMe"
        }
    },

    {
        id: 21,
        name: "WD Blue SN580 1TB M.2",
        brand: "Western Digital",
        category: "Storage",
        subcategory: "M.2",
        price: 74.99,
        oldPrice: 89.99,
        stock: 18,
        rating: 4.8,
        reviews: 276,
        featured: false,
        offer: true,
        badge: "Oferta",
        badgeType: "sale",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/storage/wd-blue-sn580-1tb.webp`,
        description:
            "Unidad M.2 NVMe compacta para computadoras de escritorio y laptops compatibles.",
        specifications: {
            "Capacidad": "1 TB",
            "Formato": "M.2 2280",
            "Interfaz": "PCIe 4.0",
            "Lectura": "4150 MB/s",
            "Escritura": "4150 MB/s",
            "Tipo": "NVMe"
        }
    },

    {
        id: 22,
        name: "Kingston mSATA SSD 480GB",
        brand: "Kingston",
        category: "Storage",
        subcategory: "mSATA",
        price: 59.99,
        oldPrice: null,
        stock: 10,
        rating: 4.5,
        reviews: 68,
        featured: false,
        offer: false,
        badge: null,
        badgeType: null,
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/storage/kingston-msata-480gb.webp`,
        description:
            "Unidad SSD mSATA para laptops y sistemas compactos compatibles.",
        specifications: {
            "Capacidad": "480 GB",
            "Interfaz": "mSATA",
            "Lectura": "550 MB/s",
            "Escritura": "500 MB/s",
            "Formato": "mSATA",
            "Tipo": "SSD"
        }
    },

    {
        id: 23,
        name: "SanDisk Ultra USB 3.2 128GB",
        brand: "SanDisk",
        category: "Storage",
        subcategory: "Removable",
        price: 18.99,
        oldPrice: 24.99,
        stock: 44,
        rating: 4.7,
        reviews: 735,
        featured: true,
        offer: true,
        badge: "Popular",
        badgeType: "hot",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/storage/sandisk-ultra-usb-128gb.webp`,
        description:
            "Unidad flash USB removible para transportar documentos, fotos y otros archivos.",
        specifications: {
            "Capacidad": "128 GB",
            "Interfaz": "USB 3.2",
            "Conector": "USB-A",
            "Lectura": "Hasta 130 MB/s",
            "Protección": "Retráctil",
            "Tipo": "Flash drive"
        }
    },

    {
        id: 24,
        name: "ASUS ZenDrive External DVD Writer",
        brand: "ASUS",
        category: "Storage",
        subcategory: "Optical",
        price: 39.99,
        oldPrice: null,
        stock: 13,
        rating: 4.6,
        reviews: 154,
        featured: false,
        offer: false,
        badge: null,
        badgeType: null,
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/storage/asus-zendrive-dvd-writer.webp`,
        description:
            "Unidad óptica externa para leer y grabar discos CD y DVD.",
        specifications: {
            "Tipo": "DVD Writer",
            "Interfaz": "USB 2.0",
            "Lectura": "CD y DVD",
            "Grabación": "CD y DVD",
            "Formato": "Externo",
            "Compatibilidad": "Windows y macOS"
        }
    },


    /* =====================================================
       COMPONENTES DE PC
    ===================================================== */

    {
        id: 25,
        name: "ASUS TUF Gaming B650-Plus WiFi",
        brand: "ASUS",
        category: "Components",
        subcategory: "Motherboards",
        price: 219.99,
        oldPrice: 249.99,
        stock: 11,
        rating: 4.8,
        reviews: 193,
        featured: true,
        offer: true,
        badge: "Oferta",
        badgeType: "sale",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/motherboards/asus-tuf-b650-plus-wifi.webp`,
        description:
            "Placa madre ATX para procesadores AMD Ryzen con soporte DDR5 y Wi-Fi integrado.",
        specifications: {
            "Socket": "AM5",
            "Chipset": "B650",
            "Formato": "ATX",
            "Memoria": "DDR5",
            "Wi-Fi": "Wi-Fi 6",
            "Ranuras M.2": "3"
        }
    },

    {
        id: 26,
        name: "MSI GeForce RTX 4060 Ventus 2X",
        brand: "MSI",
        category: "Components",
        subcategory: "Expansion Cards",
        price: 299.99,
        oldPrice: 329.99,
        stock: 9,
        rating: 4.7,
        reviews: 224,
        featured: true,
        offer: true,
        badge: "Gaming",
        badgeType: "hot",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/components/msi-rtx-4060-ventus-2x.webp`,
        description:
            "Tarjeta de expansión gráfica para videojuegos, edición y aceleración por GPU.",
        specifications: {
            "GPU": "GeForce RTX 4060",
            "Memoria": "8 GB GDDR6",
            "Interfaz": "PCIe 4.0",
            "Salidas": "HDMI y DisplayPort",
            "Ventiladores": "2",
            "Fuente recomendada": "550 W"
        }
    },

    {
        id: 27,
        name: "Noctua NH-U12S Redux",
        brand: "Noctua",
        category: "Components",
        subcategory: "Cooling",
        price: 54.99,
        oldPrice: null,
        stock: 16,
        rating: 4.9,
        reviews: 341,
        featured: true,
        offer: false,
        badge: "Silencioso",
        badgeType: "new",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/components/noctua-nh-u12s-redux.webp`,
        description:
            "Disipador de aire para procesadores con ventilador silencioso de 120 mm.",
        specifications: {
            "Tipo": "Enfriamiento por aire",
            "Ventilador": "120 mm",
            "Velocidad": "450–1700 RPM",
            "Socket Intel": "Compatible",
            "Socket AMD": "Compatible",
            "Altura": "158 mm"
        }
    },

    {
        id: 28,
        name: "Corsair RM850e 850W",
        brand: "Corsair",
        category: "Components",
        subcategory: "Power Supplies",
        price: 129.99,
        oldPrice: 149.99,
        stock: 14,
        rating: 4.8,
        reviews: 318,
        featured: true,
        offer: true,
        badge: "80 Plus Gold",
        badgeType: "hot",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/psu/corsair-rm850e-850w.webp`,
        description:
            "Fuente de alimentación modular de 850 W con certificación de eficiencia 80 Plus Gold.",
        specifications: {
            "Potencia": "850 W",
            "Certificación": "80 Plus Gold",
            "Cableado": "Completamente modular",
            "Formato": "ATX",
            "Ventilador": "120 mm",
            "Protecciones": "OVP, OCP y SCP"
        }
    },


    /* =====================================================
       IMPRESORAS
    ===================================================== */

    {
        id: 29,
        name: "Brother HL-L2405W",
        brand: "Brother",
        category: "Printers",
        subcategory: "Laser",
        price: 129.99,
        oldPrice: 149.99,
        stock: 10,
        rating: 4.7,
        reviews: 172,
        featured: true,
        offer: true,
        badge: "Oferta",
        badgeType: "sale",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/printers/brother-hl-l2405w.webp`,
        description:
            "Impresora láser monocromática inalámbrica para hogares y oficinas pequeñas.",
        specifications: {
            "Tecnología": "Láser",
            "Color": "Monocromática",
            "Conectividad": "Wi-Fi y USB",
            "Velocidad": "Hasta 30 ppm",
            "Dúplex": "Manual",
            "Tamaño de papel": "Hasta Letter"
        }
    },

    {
        id: 30,
        name: "Canon PIXMA TS7720",
        brand: "Canon",
        category: "Printers",
        subcategory: "Inkjet",
        price: 89.99,
        oldPrice: null,
        stock: 13,
        rating: 4.5,
        reviews: 96,
        featured: false,
        offer: false,
        badge: "Hogar",
        badgeType: "new",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/printers/canon-pixma-ts7720.webp`,
        description:
            "Impresora inkjet a color para documentos, tareas y fotografías.",
        specifications: {
            "Tecnología": "Inkjet",
            "Color": "A color",
            "Conectividad": "Wi-Fi y USB",
            "Impresión móvil": "Compatible",
            "Dúplex": "Automático",
            "Uso": "Hogar"
        }
    },

    {
        id: 31,
        name: "HP OfficeJet Pro 9125e",
        brand: "HP",
        category: "Printers",
        subcategory: "Multifunction",
        price: 209.99,
        oldPrice: 249.99,
        stock: 6,
        rating: 4.6,
        reviews: 118,
        featured: true,
        offer: true,
        badge: "Multifunción",
        badgeType: "hot",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/printers/hp-officejet-pro-9125e.webp`,
        description:
            "Impresora multifuncional para imprimir, copiar, escanear y enviar fax.",
        specifications: {
            "Funciones": "Imprimir, copiar, escanear y fax",
            "Tecnología": "Inkjet",
            "Color": "A color",
            "Conectividad": "Wi-Fi, Ethernet y USB",
            "Dúplex": "Automático",
            "ADF": "Sí"
        }
    },


    /* =====================================================
       MANTENIMIENTO DE IMPRESORAS
    ===================================================== */

    {
        id: 32,
        name: "Brother TN830 Black Toner",
        brand: "Brother",
        category: "Maintenance",
        subcategory: "Toner",
        price: 54.99,
        oldPrice: null,
        stock: 25,
        rating: 4.8,
        reviews: 134,
        featured: false,
        offer: false,
        badge: null,
        badgeType: null,
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/maintenance/brother-tn830-toner.webp`,
        description:
            "Cartucho de tóner negro para impresoras láser Brother compatibles.",
        specifications: {
            "Tipo": "Tóner",
            "Color": "Negro",
            "Rendimiento": "Aproximadamente 1200 páginas",
            "Tecnología": "Láser",
            "Compatibilidad": "Modelos Brother seleccionados",
            "Original": "Sí"
        }
    },

    {
        id: 33,
        name: "HP 923e Ink Cartridge Pack",
        brand: "HP",
        category: "Maintenance",
        subcategory: "Ink",
        price: 72.99,
        oldPrice: 79.99,
        stock: 19,
        rating: 4.6,
        reviews: 109,
        featured: false,
        offer: true,
        badge: "Paquete",
        badgeType: "sale",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/maintenance/hp-923e-ink-pack.webp`,
        description:
            "Paquete de cartuchos de tinta para impresoras HP OfficeJet compatibles.",
        specifications: {
            "Tipo": "Tinta",
            "Colores": "Negro, cian, magenta y amarillo",
            "Tecnología": "Inkjet",
            "Contenido": "4 cartuchos",
            "Compatibilidad": "HP OfficeJet seleccionadas",
            "Original": "Sí"
        }
    },

    {
        id: 34,
        name: "HP LaserJet Maintenance Kit",
        brand: "HP",
        category: "Maintenance",
        subcategory: "Maintenance Kits",
        price: 189.99,
        oldPrice: null,
        stock: 4,
        rating: 4.5,
        reviews: 38,
        featured: false,
        offer: false,
        badge: "Servicio",
        badgeType: "new",
        image:
            `${PRODUCT_IMAGE_BASE_PATH}/maintenance/hp-laserjet-maintenance-kit.webp`,
        description:
            "Kit de mantenimiento para reemplazar componentes desgastados de impresoras láser compatibles.",
        specifications: {
            "Tipo": "Kit de mantenimiento",
            "Incluye": "Fusor y rodillos",
            "Tecnología": "Láser",
            "Uso": "Mantenimiento preventivo",
            "Compatibilidad": "HP LaserJet seleccionadas",
            "Instalación": "Técnica"
        }
    }
];


/* =========================================================
   3. FUNCIONES AUXILIARES
========================================================= */

/**
 * Busca un producto mediante su identificador.
 *
 * @param {number|string} productId
 * @returns {object|null}
 */
function getProductById(productId) {
    const normalizedId = Number(productId);

    return products.find(
        product => product.id === normalizedId
    ) || null;
}


/**
 * Obtiene todos los nombres de categorías disponibles.
 *
 * @returns {string[]}
 */
function getProductCategories() {
    return [
        ...new Set(
            products.map(product => product.category)
        )
    ];
}


/**
 * Obtiene las subcategorías de una categoría determinada.
 *
 * @param {string} category
 * @returns {string[]}
 */
function getSubcategoriesByCategory(category) {
    return [
        ...new Set(
            products
                .filter(
                    product => product.category === category
                )
                .map(
                    product => product.subcategory
                )
        )
    ];
}


/**
 * Obtiene todos los productos que estén en oferta.
 *
 * @returns {object[]}
 */
function getOfferProducts() {
    return products.filter(
        product => product.offer === true
    );
}


/**
 * Obtiene los productos destacados.
 *
 * @returns {object[]}
 */
function getFeaturedProducts() {
    return products.filter(
        product => product.featured === true
    );
}


/**
 * Verifica si un producto está disponible.
 *
 * @param {object} product
 * @returns {boolean}
 */
function isProductInStock(product) {
    return Boolean(product && product.stock > 0);
}


/**
 * Devuelve las primeras especificaciones de un producto.
 *
 * Se utilizará para la vista rápida sobre la imagen
 * de cada tarjeta.
 *
 * @param {object} product
 * @param {number} limit
 * @returns {Array<[string, string]>}
 */
function getQuickSpecifications(product, limit = 4) {
    if (
        !product ||
        !product.specifications ||
        typeof product.specifications !== "object"
    ) {
        return [];
    }

    return Object.entries(product.specifications)
        .slice(0, limit);
}


/**
 * Formatea una cantidad como precio.
 *
 * @param {number} amount
 * @returns {string}
 */
function formatPrice(amount) {
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount)) {
        return "$0.00";
    }

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD"
        }
    ).format(numericAmount);
}


/**
 * Normaliza texto para búsquedas.
 *
 * Elimina acentos, convierte a minúsculas
 * y limpia espacios adicionales.
 *
 * @param {string} text
 * @returns {string}
 */
function normalizeProductText(text) {
    return String(text ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}


/**
 * Crea una cadena de texto con toda la información
 * importante de un producto.
 *
 * Esto permitirá buscar por nombre, marca, categoría,
 * subcategoría, descripción y especificaciones.
 *
 * @param {object} product
 * @returns {string}
 */
function getProductSearchText(product) {
    if (!product) {
        return "";
    }

    const specificationText = Object.entries(
        product.specifications || {}
    )
        .map(
            ([key, value]) => `${key} ${value}`
        )
        .join(" ");

    return normalizeProductText(
        [
            product.name,
            product.brand,
            product.category,
            product.subcategory,
            product.description,
            specificationText
        ].join(" ")
    );
}


/* =========================================================
   4. VALIDACIÓN DEL CATÁLOGO
========================================================= */

/**
 * Detecta identificadores repetidos o información esencial
 * faltante durante el desarrollo.
 *
 * Los mensajes aparecerán únicamente en la consola.
 */
function validateProductCatalog() {
    const usedIds = new Set();

    products.forEach(product => {
        const requiredProperties = [
            "id",
            "name",
            "brand",
            "category",
            "subcategory",
            "price",
            "image"
        ];

        requiredProperties.forEach(property => {
            if (
                product[property] === undefined ||
                product[property] === null ||
                product[property] === ""
            ) {
                console.warn(
                    `LeNCHoTeCH: el producto con ID ${product.id} ` +
                    `no tiene la propiedad obligatoria "${property}".`
                );
            }
        });

        if (usedIds.has(product.id)) {
            console.error(
                `LeNCHoTeCH: el ID ${product.id} está repetido.`
            );
        }

        usedIds.add(product.id);

        if (
            typeof product.price !== "number" ||
            product.price < 0
        ) {
            console.warn(
                `LeNCHoTeCH: el producto "${product.name}" ` +
                "tiene un precio inválido."
            );
        }

        if (
            typeof product.stock !== "number" ||
            product.stock < 0
        ) {
            console.warn(
                `LeNCHoTeCH: el producto "${product.name}" ` +
                "tiene una cantidad de inventario inválida."
            );
        }
    });
}


/* =========================================================
   5. EJECUCIÓN DE VALIDACIÓN
========================================================= */

validateProductCatalog();


/* =========================================================
   6. EXPOSICIÓN GLOBAL
========================================================= */

/*
    Como el proyecto utiliza scripts tradicionales y no módulos,
    hacemos que la información y las funciones estén disponibles
    desde los demás archivos JavaScript.
*/

window.LENCHOTECH_PRODUCTS = products;

window.LENCHOTECH_PRODUCT_UTILS = {
    PRODUCT_IMAGE_BASE_PATH,
    PRODUCT_PLACEHOLDER_PATH,
    getProductById,
    getProductCategories,
    getSubcategoriesByCategory,
    getOfferProducts,
    getFeaturedProducts,
    getQuickSpecifications,
    getProductSearchText,
    isProductInStock,
    formatPrice,
    normalizeProductText
};