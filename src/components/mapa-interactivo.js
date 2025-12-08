// src/components/mapa-interactivo.js
// Sistema de gestión de recolección Plasticket - Versión Astro Optimizada

// Datos iniciales de puntos de reciclaje (10 ubicaciones en Ibagué)
const locations = [
    {
        id: 1,
        lat: 4.4389,
        lng: -75.2322,
        name: 'Centro de Ibagué',
        address: 'Calle 10 # 5-20, Centro',
        applicantName: 'Juan Pérez',
        phone: '3123456789',
        email: 'juan.perez@email.com',
        materialType: 'Plástico',
        weight: '25 kg',
        status: 'pendiente'
    },
    {
        id: 2,
        lat: 4.4450,
        lng: -75.2400,
        name: 'Parque Centenario',
        address: 'Carrera 5 # 10-30',
        applicantName: 'María Gómez',
        phone: '3101234567',
        email: 'maria.gomez@email.com',
        materialType: 'Papel/Cartón',
        weight: '15 kg',
        status: 'pendiente'
    },
    {
        id: 3,
        lat: 4.4280,
        lng: -75.2250,
        name: 'Terminal de Transportes',
        address: 'Av. Ferrocarril # 12-45',
        applicantName: 'Carlos López',
        phone: '3112345678',
        email: 'carlos.lopez@email.com',
        materialType: 'Vidrio',
        weight: '30 kg',
        status: 'pendiente'
    },
    {
        id: 4,
        lat: 4.4500,
        lng: -75.2150,
        name: 'Museo Panóptico',
        address: 'Calle 15 # 8-40',
        applicantName: 'Ana Rodríguez',
        phone: '3134567890',
        email: 'ana.rodriguez@email.com',
        materialType: 'Metales',
        weight: '20 kg',
        status: 'pendiente'
    },
    {
        id: 5,
        lat: 4.4350,
        lng: -75.2200,
        name: 'Plaza de Mercado',
        address: 'Carrera 3 # 10-10',
        applicantName: 'Luis Martínez',
        phone: '3145678901',
        email: 'luis.martinez@email.com',
        materialType: 'Orgánico',
        weight: '40 kg',
        status: 'pendiente'
    },
    {
        id: 6,
        lat: 4.4420,
        lng: -75.2300,
        name: 'Unibagué',
        address: 'Carrera 22 # 1-01',
        applicantName: 'Sofía Hernández',
        phone: '3156789012',
        email: 'sofia.hernandez@email.com',
        materialType: 'Electrónicos',
        weight: '12 kg',
        status: 'pendiente'
    },
    {
        id: 7,
        lat: 4.4250,
        lng: -75.2350,
        name: 'Hospital San Francisco',
        address: 'Calle 20 # 5-50',
        applicantName: 'Pedro Díaz',
        phone: '3167890123',
        email: 'pedro.diaz@email.com',
        materialType: 'Plástico',
        weight: '18 kg',
        status: 'pendiente'
    },
    {
        id: 8,
        lat: 4.4600,
        lng: -75.2100,
        name: 'Jardín Botánico',
        address: 'Carrera 2 # 10-60',
        applicantName: 'Laura Torres',
        phone: '3178901234',
        email: 'laura.torres@email.com',
        materialType: 'Papel/Cartón',
        weight: '22 kg',
        status: 'pendiente'
    },
    {
        id: 9,
        lat: 4.4300,
        lng: -75.2150,
        name: 'Estadio Manuel Murillo Toro',
        address: 'Carrera 5 # 20-30',
        applicantName: 'Andrés Silva',
        phone: '3189012345',
        email: 'andres.silva@email.com',
        materialType: 'Vidrio',
        weight: '35 kg',
        status: 'pendiente'
    },
    {
        id: 10,
        lat: 4.4400,
        lng: -75.2250,
        name: 'Centro Comercial La Estación',
        address: 'Av. Ambalá # 10-80',
        applicantName: 'Carmen Vargas',
        phone: '3190123456',
        email: 'carmen.vargas@email.com',
        materialType: 'Metales',
        weight: '28 kg',
        status: 'pendiente'
    }
];

// Equipos de cuadrilla disponibles
const teams = [
    {
        id: 1,
        name: 'Equipo Alpha',
        completedToday: 3,
        kgCollectedToday: 150,
        members: 4,
        vehicle: 'Camión F-350'
    },
    {
        id: 2,
        name: 'Equipo Beta',
        completedToday: 5,
        kgCollectedToday: 230,
        members: 3,
        vehicle: 'Camión F-250'
    },
    {
        id: 3,
        name: 'Equipo Gamma',
        completedToday: 2,
        kgCollectedToday: 90,
        members: 5,
        vehicle: 'Camión F-150'
    },
    {
        id: 4,
        name: 'Equipo Delta',
        completedToday: 4,
        kgCollectedToday: 180,
        members: 4,
        vehicle: 'Furgón Mercedes'
    },
    {
        id: 5,
        name: 'Equipo Épsilon',
        completedToday: 6,
        kgCollectedToday: 300,
        members: 3,
        vehicle: 'Camión Volvo'
    },
    {
        id: 6,
        name: 'Equipo Zeta',
        completedToday: 1,
        kgCollectedToday: 45,
        members: 3,
        vehicle: 'Camión Renault'
    },
    {
        id: 7,
        name: 'Equipo Omega',
        completedToday: 3,
        kgCollectedToday: 120,
        members: 4,
        vehicle: 'Camión Mercedes'
    }
];

// Variables globales
let map;
let selectedLocation = null;
let selectedTeam = null;
let markers = [];
let teamMarkers = [];
let routeLayers = [];

// URL base de OSRM (Open Source Routing Machine) - GRATUITO
const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

// Función para calcular distancia ficticia (simulada)
function calculateDistance(teamIndex, locationIndex) {
    const baseDistances = [2.5, 3.8, 1.2, 4.5, 2.0, 3.3, 1.8, 4.0, 2.7, 3.5];
    const teamAdjustments = [0.5, 0.8, 0.2, 0.7, 0.3, 0.4, 0.6];

    let distance = baseDistances[locationIndex] + (teamAdjustments[teamIndex] || 0);
    distance += (Math.random() * 0.5 - 0.25);
    return Math.max(0.5, distance.toFixed(2));
}

// Inicializar mapa cuando el DOM esté listo
export function initMap() {
    // Crear el mapa
    map = L.map('map').setView([4.4389, -75.2322], 13);

    // Añadir capa de tiles (OSM)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Crear marcadores
    createMarkers();
}

// Crear marcadores
function createMarkers() {
    // Array de colores para los números (10 colores diferentes)
    const colores = [
        'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500',
        'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'
    ];

    locations.forEach((location, index) => {
        const numero = index + 1;
        const color = colores[index % colores.length];

        const recycleIcon = L.divIcon({
            html: `
                <div class="relative">
                    <div class="w-10 h-10 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
                        <i data-lucide="recycle" class="w-6 h-6 text-white"></i>
                    </div>
                    <div class="absolute -top-1 -right-1 w-5 h-5 ${color} rounded-full flex items-center justify-center text-xs text-white font-bold">
                        ${numero}
                    </div>
                </div>
            `,
            className: 'custom-div-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });

        const marker = L.marker([location.lat, location.lng], {
            icon: recycleIcon,
            riseOnHover: true
        })
            .addTo(map)
            .bindPopup(`
            <div class="p-2">
                <h3 class="font-bold text-green-700 dark:text-green-400">${location.name}</h3>
                <p class="text-sm text-gray-800 dark:text-gray-300">${location.materialType} - ${location.weight}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">${location.applicantName}</p>
                <div class="mt-1 text-xs">
                    <span class="inline-block w-3 h-3 ${color} rounded-full mr-1"></span>
                    Punto #${numero}
                </div>
            </div>
        `);

        markers.push(marker);

        marker.on('click', function() {
            showLocationInfo(location);
        });
    });
}

// Mostrar información de ubicación
function showLocationInfo(location) {
    selectedLocation = location;

    const infoPanel = document.getElementById('infoPanel');

    infoPanel.innerHTML = `
        <div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg p-4 mb-4">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-xl font-bold flex items-center gap-2">
                        <i data-lucide="recycle" class="w-6 h-6"></i>
                        ${location.name}
                    </h3>
                    <p class="text-sm opacity-90">Punto de Reciclaje</p>
                </div>
                <button onclick="window.closeInfoPanel()" class="text-white hover:text-gray-200 transition-colors">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            <div class="mt-2 flex items-center gap-2">
                <span class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">${location.materialType}</span>
                <span class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">${location.weight}</span>
                <span class="px-3 py-1 bg-yellow-500 rounded-full text-sm">${location.status}</span>
            </div>
        </div>
        
        <div class="px-4 pb-4 space-y-4">
            <div>
                <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                    <i data-lucide="user" class="w-4 h-4"></i>
                    Información del Solicitante
                </h4>
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <p class="text-gray-600 dark:text-gray-300">Nombre</p>
                        <p class="font-medium text-gray-800 dark:text-gray-100">${location.applicantName}</p>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <p class="text-gray-600 dark:text-gray-300">Teléfono</p>
                        <p class="font-medium text-gray-800 dark:text-gray-100">${location.phone}</p>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg col-span-2">
                        <p class="text-gray-600 dark:text-gray-300">Correo Electrónico</p>
                        <p class="font-medium text-gray-800 dark:text-gray-100">${location.email}</p>
                    </div>
                </div>
            </div>
            
            <div>
                <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                    <i data-lucide="map-pin" class="w-4 h-4"></i>
                    Dirección
                </h4>
                <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-sm">
                    <p class="font-medium text-gray-800 dark:text-gray-100">${location.address}</p>
                    <p class="text-gray-600 dark:text-gray-400 mt-1">Ibagué, Tolima</p>
                </div>
            </div>
            
            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                ${location.status === 'pendiente' ?
        `<div class="cursor-pointer" onclick="window.showTeamSelector()">
                        <div class="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border border-green-200 dark:border-gray-600 rounded-lg p-3 hover:border-green-300 dark:hover:border-green-500 transition-colors">
                            <div class="flex items-center gap-2">
                                <i data-lucide="truck" class="w-5 h-5 text-green-600 dark:text-green-400"></i>
                                <div>
                                    <span class="font-semibold text-gray-800 dark:text-gray-200">Asignar Equipo de Recolección</span>
                                    <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Haz clic para ver equipos disponibles</p>
                                </div>
                            </div>
                            <i data-lucide="chevron-down" class="w-4 h-4 text-gray-400"></i>
                        </div>
                        
                        <div id="teamSelector" class="hidden mt-4 space-y-3 max-h-64 overflow-y-auto pr-2" style="scrollbar-width: thin;">
                            <h5 class="font-medium text-gray-800 dark:text-gray-200">Selecciona un equipo:</h5>
                            <!-- Las opciones se generarán dinámicamente -->
                        </div>
                    </div>`
        :
        `<div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 border border-blue-200 dark:border-gray-600 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center gap-2">
                                <i data-lucide="check-circle" class="w-5 h-5 text-blue-600 dark:text-blue-400"></i>
                                <span class="font-semibold text-gray-800 dark:text-gray-200">Solicitud asignada</span>
                            </div>
                            <span class="px-2 py-1 bg-blue-500 text-white text-xs rounded">${location.assignedTeam || 'Equipo asignado'}</span>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">No se pueden hacer más asignaciones para esta solicitud</p>
                        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <p>📅 Asignado: ${location.assignedTime || new Date().toLocaleDateString()}</p>
                        </div>
                    </div>`
    }
            </div>
            
            <div class="text-xs text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex justify-between">
                    <p>📍 Lat: ${location.lat.toFixed(4)}</p>
                    <p>📍 Lng: ${location.lng.toFixed(4)}</p>
                </div>
                <p class="mt-1">ID: REC-${location.id.toString().padStart(3, '0')}</p>
            </div>
        </div>
    `;

    infoPanel.classList.remove('hidden');

    // Centrar mapa
    map.flyTo([location.lat, location.lng], 16);

    // Actualizar iconos
    if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons();
    }
}

// Mostrar selector de equipos con scroll
window.showTeamSelector = function() {
    if (!selectedLocation || selectedLocation.status !== 'pendiente') {
        showNotification('⚠️ Esta solicitud ya ha sido asignada');
        return;
    }

    const teamSelector = document.getElementById('teamSelector');
    teamSelector.innerHTML = '';

    const availableTeams = teams.filter(team => {
        const isAssignedToThisLocation = selectedLocation.assignedTeamId === team.id;
        const isBusy = locations.some(loc =>
            loc.status === 'asignado' &&
            loc.assignedTeamId === team.id &&
            loc.id !== selectedLocation.id
        );
        return !isAssignedToThisLocation && !isBusy;
    });

    if (availableTeams.length === 0) {
        teamSelector.innerHTML = `
            <div class="text-center py-4 border border-yellow-200 dark:border-yellow-800 rounded-lg bg-yellow-50 dark:bg-yellow-900/30">
                <i data-lucide="alert-triangle" class="w-8 h-8 text-yellow-500 dark:text-yellow-400 mx-auto mb-2"></i>
                <p class="font-medium text-yellow-700 dark:text-yellow-300">No hay equipos disponibles</p>
                <p class="text-sm text-yellow-600 dark:text-yellow-400 mt-1">Todos los equipos están ocupados o ya asignados</p>
            </div>
        `;
        if (window.lucide && window.lucide.createIcons) {
            window.lucide.createIcons();
        }
        teamSelector.classList.remove('hidden');
        return;
    }

    availableTeams.forEach((team, index) => {
        const distance = calculateDistance(index, selectedLocation.id - 1);

        const teamCard = document.createElement('div');
        teamCard.className = 'border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-gray-800 cursor-pointer transition-all';
        teamCard.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <h6 class="font-semibold text-gray-800 dark:text-gray-200">${team.name}</h6>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${team.vehicle} • ${team.members} miembros</p>
                </div>
                <div class="text-right">
                    <p class="font-bold text-green-600 dark:text-green-400">${distance} km</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">distancia</p>
                </div>
            </div>
            <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
                <span>✅ ${team.completedToday} solicitudes hoy</span>
                <span>♻️ ${team.kgCollectedToday} kg recolectados</span>
            </div>
        `;

        teamCard.addEventListener('click', () => window.showConfirmationModal(team, distance));
        teamSelector.appendChild(teamCard);
    });

    teamSelector.classList.remove('hidden');
    if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons();
    }
};

// Mostrar modal de confirmación
window.showConfirmationModal = function(team, distance) {
    if (!selectedLocation || selectedLocation.status !== 'pendiente') {
        showNotification('⚠️ Esta solicitud ya ha sido asignada');
        return;
    }

    if (selectedLocation.assignedTeamId === team.id) {
        showNotification('⚠️ Este equipo ya está asignado a esta solicitud');
        return;
    }

    selectedTeam = team;

    const modal = document.createElement('div');
    modal.id = 'confirmationModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full transform transition-all">
            <div class="p-6">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <i data-lucide="alert-triangle" class="w-6 h-6 text-green-600 dark:text-green-400"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-800 dark:text-gray-200 text-lg">Confirmar Asignación</h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm">¿Asignar esta solicitud al equipo seleccionado?</p>
                    </div>
                </div>
                
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border border-green-100 dark:border-gray-600 rounded-lg p-4 mb-6">
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-gray-600 dark:text-gray-300">Equipo asignado:</p>
                            <p class="font-semibold text-green-700 dark:text-green-400">${team.name}</p>
                        </div>
                        <div>
                            <p class="text-gray-600 dark:text-gray-300">Distancia:</p>
                            <p class="font-semibold text-gray-800 dark:text-gray-200">${distance} km</p>
                        </div>
                        <div>
                            <p class="text-gray-600 dark:text-gray-300">Solicitudes hoy:</p>
                            <p class="font-semibold text-gray-800 dark:text-gray-200">${team.completedToday}</p>
                        </div>
                        <div>
                            <p class="text-gray-600 dark:text-gray-300">KG recolectados:</p>
                            <p class="font-semibold text-gray-800 dark:text-gray-200">${team.kgCollectedToday} kg</p>
                        </div>
                    </div>
                    <div class="mt-3 pt-3 border-t border-green-200 dark:border-gray-600">
                        <p class="text-gray-600 dark:text-gray-400 text-xs">Vehículo: ${team.vehicle}</p>
                        <p class="text-gray-600 dark:text-gray-400 text-xs">Miembros: ${team.members} personas</p>
                    </div>
                </div>
                
                <div class="flex gap-3">
                    <button onclick="window.confirmAssignment()" class="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-800 transition-all">
                        Sí, asignar equipo
                    </button>
                    <button onclick="window.cancelAssignment()" class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons();
    }
};

// OBTENER RUTAS REALES DE OSRM (Open Source Routing Machine)
async function getOSRMRoutes(start, end) {
    try {
        // Formato: lon,lat para OSRM
        const startCoords = `${start[1]},${start[0]}`;
        const endCoords = `${end[1]},${end[0]}`;

        const response = await fetch(
            `${OSRM_BASE_URL}/${startCoords};${endCoords}?overview=full&alternatives=3&steps=true&geometries=geojson`
        );

        if (!response.ok) {
            throw new Error('Error al obtener rutas OSRM');
        }

        const data = await response.json();

        if (data.code === 'Ok') {
            return data.routes;
        }
        return null;
    } catch (error) {
        console.warn('Error en OSRM, usando rutas simuladas:', error);
        return null;
    }
}

// DIBUJAR RUTAS OPTIMIZADAS SIGUIENDO CALLES REALES
async function drawOptimizedRoutes(start, end) {
    // Limpiar rutas anteriores
    routeLayers.forEach(layer => map.removeLayer(layer));
    routeLayers = [];

    // Intentar obtener rutas reales de OSRM
    const osrmRoutes = await getOSRMRoutes(start, end);

    if (osrmRoutes && osrmRoutes.length > 0) {
        // Usar rutas reales de OSRM
        drawOSRMRoutes(osrmRoutes, start, end);
    } else {
        // Fallback: rutas simuladas mejoradas
        drawEnhancedSimulatedRoutes(start, end);
    }
}

// DIBUJAR RUTAS REALES DE OSRM
function drawOSRMRoutes(routes, start, end) {
    const colors = ['#3B82F6', '#10B981', '#8B5CF6'];
    const opacities = [0.9, 0.7, 0.5];
    const weights = [4, 3, 2];

    // Ordenar rutas por distancia (más corta primero)
    routes.sort((a, b) => a.distance - b.distance);

    routes.forEach((route, index) => {
        if (index >= 3) return;

        // Extraer coordenadas de la ruta
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

        // Crear polilínea
        const polyline = L.polyline(coordinates, {
            color: colors[index],
            weight: weights[index],
            opacity: opacities[index],
            dashArray: index === 0 ? null : '10, 10',
            lineCap: 'round',
            lineJoin: 'round',
            smoothFactor: 1
        }).addTo(map);

        // Calcular distancia y tiempo
        const distance = (route.distance / 1000).toFixed(2);
        const time = Math.round(route.duration / 60);

        // Agregar popup con información
        polyline.bindPopup(`
            <div class="p-3 min-w-[200px] bg-white dark:bg-gray-800 rounded-lg">
                <h4 class="font-bold text-gray-800 dark:text-gray-200 mb-2">Ruta ${index + 1} ${index === 0 ? '⭐' : ''}</h4>
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <i data-lucide="map" class="w-4 h-4 text-blue-500"></i>
                        <span class="text-sm text-gray-700 dark:text-gray-300">Distancia: <strong>${distance} km</strong></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <i data-lucide="clock" class="w-4 h-4 text-green-500"></i>
                        <span class="text-sm text-gray-700 dark:text-gray-300">Tiempo estimado: <strong>${time} min</strong></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <i data-lucide="navigation" class="w-4 h-4 text-purple-500"></i>
                        <span class="text-sm text-gray-700 dark:text-gray-300">${route.legs[0]?.steps?.length || 'N/A'} segmentos</span>
                    </div>
                </div>
                <div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div class="flex items-center">
                        <div class="w-3 h-3 rounded-full mr-2" style="background-color: ${colors[index]}"></div>
                        <span class="text-xs text-gray-600 dark:text-gray-400">${index === 0 ? 'Ruta óptima' : 'Alternativa'}</span>
                    </div>
                </div>
            </div>
        `);

        // Destacar ruta principal con animación
        if (index === 0) {
            polyline.bringToFront();

            let pulseDirection = true;
            setInterval(() => {
                polyline.setStyle({
                    weight: pulseDirection ? 5 : 4,
                    opacity: pulseDirection ? 1 : 0.9
                });
                pulseDirection = !pulseDirection;
            }, 1000);
        }

        routeLayers.push(polyline);
    });

    // Añadir marcadores especiales para inicio y fin
    addRouteMarkers(start, end);

    // Ajustar vista para mostrar todas las rutas
    adjustMapToRoutes(start, end, routes);
}

// AÑADIR MARCADORES DE RUTA
function addRouteMarkers(start, end) {
    // Icono para equipo (inicio)
    const truckIcon = L.divIcon({
        html: `
            <div class="relative">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-xl border-3 border-white dark:border-gray-800 animate-pulse">
                    <i data-lucide="truck" class="w-7 h-7 text-white"></i>
                </div>
                <div class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shadow-md">
                    ${selectedTeam?.name || 'EQUIPO'}
                </div>
            </div>
        `,
        className: 'custom-div-icon',
        iconSize: [48, 65],
        iconAnchor: [24, 65]
    });

    // Icono para reciclaje (fin)
    const recycleIcon = L.divIcon({
        html: `
            <div class="relative">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-700 rounded-full flex items-center justify-center shadow-xl border-3 border-white dark:border-gray-800">
                    <i data-lucide="recycle" class="w-7 h-7 text-white"></i>
                </div>
                <div class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shadow-md">
                    RECOLECCIÓN
                </div>
            </div>
        `,
        className: 'custom-div-icon',
        iconSize: [48, 65],
        iconAnchor: [24, 65]
    });

    // Crear marcadores
    const startMarker = L.marker(start, {
        icon: truckIcon,
        zIndexOffset: 1000
    }).addTo(map);

    const endMarker = L.marker(end, {
        icon: recycleIcon,
        zIndexOffset: 1000
    }).addTo(map);

    // Agregar popups
    startMarker.bindPopup(`
        <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-1">🏁 Punto de inicio</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300">Equipo: <strong>${selectedTeam?.name || 'N/A'}</strong></p>
            <p class="text-sm text-gray-700 dark:text-gray-300">Vehículo: ${selectedTeam?.vehicle || 'N/A'}</p>
            <p class="text-xs text-gray-600 dark:text-gray-400">${selectedTeam?.members || 0} miembros</p>
        </div>
    `);

    endMarker.bindPopup(`
        <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <h4 class="font-bold text-green-600 dark:text-green-400 mb-1">🎯 Punto de recolección</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300">${selectedLocation?.name || 'N/A'}</p>
            <p class="text-sm text-gray-700 dark:text-gray-300">${selectedLocation?.materialType || 'N/A'} - ${selectedLocation?.weight || 'N/A'}</p>
            <p class="text-xs text-gray-600 dark:text-gray-400">${selectedLocation?.address || 'N/A'}</p>
        </div>
    `);

    routeLayers.push(startMarker, endMarker);

    // Actualizar iconos de Lucide
    setTimeout(() => {
        if (window.lucide && window.lucide.createIcons) {
            window.lucide.createIcons();
        }
    }, 100);
}

// RUTAS SIMULADAS MEJORADAS (fallback cuando OSRM no funciona)
function drawEnhancedSimulatedRoutes(start, end) {
    const colors = ['#3B82F6', '#10B981', '#8B5CF6'];
    const opacities = [0.9, 0.7, 0.5];
    const weights = [4, 3, 2];

    for (let i = 0; i < 3; i++) {
        const points = generateSmartRoute(start, end, i);

        const polyline = L.polyline(points, {
            color: colors[i],
            weight: weights[i],
            opacity: opacities[i],
            dashArray: i === 0 ? null : '10, 10',
            lineCap: 'round',
            lineJoin: 'round',
            smoothFactor: 1
        }).addTo(map);

        // Calcular distancia aproximada
        const distance = calculateRouteDistance(points).toFixed(2);
        const time = Math.round(distance * 15);

        polyline.bindPopup(`
            <div class="p-3 min-w-[200px] bg-white dark:bg-gray-800 rounded-lg">
                <h4 class="font-bold text-gray-800 dark:text-gray-200 mb-2">Ruta simulada ${i + 1}</h4>
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <i data-lucide="map" class="w-4 h-4 text-blue-500"></i>
                        <span class="text-sm text-gray-700 dark:text-gray-300">Distancia estimada: <strong>${distance} km</strong></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <i data-lucide="clock" class="w-4 h-4 text-green-500"></i>
                        <span class="text-sm text-gray-700 dark:text-gray-300">Tiempo estimado: <strong>${time} min</strong></span>
                    </div>
                </div>
                <div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p class="text-xs text-yellow-600 dark:text-yellow-400">⚠️ Ruta simulada - no sigue calles reales</p>
                </div>
            </div>
        `);

        routeLayers.push(polyline);
    }

    // Añadir marcadores
    addRouteMarkers(start, end);

    // Ajustar vista
    adjustMapToRoutes(start, end);
}

// GENERAR RUTA INTELIGENTE SIMULADA
function generateSmartRoute(start, end, routeIndex) {
    const points = [start];
    const numSegments = 10 + routeIndex * 3;

    // Calcular dirección general
    const latDiff = end[0] - start[0];
    const lngDiff = end[1] - start[1];

    // Diferentes tipos de rutas simuladas
    for (let j = 1; j < numSegments; j++) {
        const progress = j / numSegments;
        const t = progress;

        let lat, lng;

        switch(routeIndex) {
            case 0: // Ruta principal - más directa
                lat = start[0] + latDiff * t;
                lng = start[1] + lngDiff * t;
                // Pequeñas curvas suaves
                lat += Math.sin(t * Math.PI * 2) * 0.0003;
                lng += Math.cos(t * Math.PI * 2) * 0.0003;
                break;

            case 1: // Ruta alternativa 1 - más panorámica
                lat = start[0] + latDiff * (t + 0.1 * Math.sin(t * Math.PI));
                lng = start[1] + lngDiff * (t + 0.1 * Math.cos(t * Math.PI));
                lat += Math.sin(t * Math.PI * 3) * 0.0005;
                lng += Math.cos(t * Math.PI * 3) * 0.0005;
                break;

            case 2: // Ruta alternativa 2 - más rápida (menos curvas)
                lat = start[0] + latDiff * t;
                lng = start[1] + lngDiff * t;
                // Solo 2 curvas grandes
                if (t > 0.3 && t < 0.7) {
                    lat += 0.0008 * Math.sin((t - 0.3) * Math.PI * 2.5);
                    lng += 0.0008 * Math.cos((t - 0.3) * Math.PI * 2.5);
                }
                break;
        }

        points.push([lat, lng]);
    }

    points.push(end);
    return points;
}

// CALCULAR DISTANCIA DE RUTA
function calculateRouteDistance(points) {
    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
        const lat1 = points[i][0], lng1 = points[i][1];
        const lat2 = points[i+1][0], lng2 = points[i+1][1];

        // Fórmula de Haversine aproximada
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        totalDistance += R * c;
    }
    return totalDistance;
}

// AJUSTAR MAPA PARA MOSTRAR RUTAS
function adjustMapToRoutes(start, end, routes = null) {
    const bounds = L.latLngBounds([start, end]);

    // Extender bounds con todas las rutas
    routeLayers.forEach(layer => {
        try {
            bounds.extend(layer.getBounds());
        } catch (e) {
            // Si es un marcador, extender con su posición
            if (layer.getLatLng) {
                bounds.extend(layer.getLatLng());
            }
        }
    });

    // Ajustar zoom con padding
    map.fitBounds(bounds, {
        padding: [100, 100],
        maxZoom: 16,
        animate: true,
        duration: 1.5
    });
}

// Confirmar asignación
window.confirmAssignment = function() {
    if (!selectedLocation || !selectedTeam) return;

    if (selectedLocation.status !== 'pendiente') {
        showNotification('⚠️ Esta solicitud ya ha sido asignada anteriormente');
        window.cancelAssignment();
        return;
    }

    document.getElementById('confirmationModal').remove();

    const offsetLat = (Math.random() * 0.008) - 0.004;
    const offsetLng = (Math.random() * 0.008) - 0.004;

    const teamLat = selectedLocation.lat + offsetLat;
    const teamLng = selectedLocation.lng + offsetLng;

    const teamIcon = L.divIcon({
        html: `
            <div class="relative">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-xl border-3 border-white dark:border-gray-800 animate-pulse">
                    <i data-lucide="truck" class="w-7 h-7 text-white"></i>
                </div>
                <div class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shadow-md">
                    ${selectedTeam.name}
                </div>
            </div>
        `,
        className: 'custom-div-icon',
        iconSize: [48, 65],
        iconAnchor: [24, 65]
    });

    const teamMarker = L.marker([teamLat, teamLng], {
        icon: teamIcon,
        zIndexOffset: 1000
    }).addTo(map);

    teamMarkers.push(teamMarker);

    const locationIndex = locations.findIndex(loc => loc.id === selectedLocation.id);
    if (locationIndex !== -1) {
        locations[locationIndex].status = 'asignado';
        locations[locationIndex].assignedTeam = selectedTeam.name;
        locations[locationIndex].assignedTeamId = selectedTeam.id;
        locations[locationIndex].assignedTime = new Date().toLocaleString();
    }

    selectedLocation.status = 'asignado';
    selectedLocation.assignedTeam = selectedTeam.name;
    selectedLocation.assignedTeamId = selectedTeam.id;
    selectedLocation.assignedTime = new Date().toLocaleString();

    drawOptimizedRoutes([teamLat, teamLng], [selectedLocation.lat, selectedLocation.lng]);

    const infoPanel = document.getElementById('infoPanel');
    if (infoPanel) {
        const assignmentSection = infoPanel.querySelector('.pt-4.border-t');
        if (assignmentSection) {
            assignmentSection.innerHTML = `
                <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 border border-blue-200 dark:border-gray-600 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <i data-lucide="check-circle" class="w-5 h-5 text-blue-600 dark:text-blue-400"></i>
                            <span class="font-semibold text-gray-800 dark:text-gray-200">Solicitud asignada</span>
                        </div>
                        <span class="px-2 py-1 bg-blue-500 text-white text-xs rounded">${selectedTeam.name}</span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Equipo asignado exitosamente</p>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <p class="text-gray-600 dark:text-gray-300">Vehículo:</p>
                            <p class="font-medium text-gray-800 dark:text-gray-200">${selectedTeam.vehicle}</p>
                        </div>
                        <div>
                            <p class="text-gray-600 dark:text-gray-300">Hora asignación:</p>
                            <p class="font-medium text-gray-800 dark:text-gray-200">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                    </div>
                    <div class="mt-3 pt-2 border-t border-blue-200 dark:border-gray-600">
                        <p class="text-xs text-gray-500 dark:text-gray-400">ID de asignación: ASG-${selectedLocation.id.toString().padStart(3, '0')}-${selectedTeam.id}</p>
                    </div>
                </div>
            `;
        }

        const statusElement = infoPanel.querySelector('.bg-yellow-500');
        if (statusElement) {
            statusElement.textContent = 'asignado';
            statusElement.className = 'px-3 py-1 bg-blue-500 rounded-full text-sm text-white';
        }
    }

    updateTeamStats(selectedTeam.id);

    if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons();
    }

    showNotification(`✅ ${selectedTeam.name} asignado a ${selectedLocation.name}`);
};

// Actualizar estadísticas del equipo
function updateTeamStats(teamId) {
    const team = teams.find(t => t.id === teamId);
    if (team && !team.lastAssignmentLocationId) {
        team.completedToday += 1;
        team.kgCollectedToday += parseInt(selectedLocation.weight) || 10;
        team.lastAssignmentLocationId = selectedLocation.id;

        const statsPanel = document.querySelector('.absolute.top-4.left-4');
        if (statsPanel) {
            const completedElement = statsPanel.querySelector('.text-blue-600');
            const collectedElement = statsPanel.querySelector('.text-green-600');

            if (completedElement) {
                completedElement.textContent = teams.reduce((sum, t) => sum + t.completedToday, 0);
            }
            if (collectedElement) {
                collectedElement.textContent = teams.reduce((sum, t) => sum + t.kgCollectedToday, 0) + ' kg';
            }
        }
    }
}

// Cancelar asignación
window.cancelAssignment = function() {
    selectedTeam = null;
    const modal = document.getElementById('confirmationModal');
    if (modal) modal.remove();
};

// Cerrar panel
window.closeInfoPanel = function() {
    document.getElementById('infoPanel').classList.add('hidden');
    selectedLocation = null;
    selectedTeam = null;

    // Limpiar rutas y marcadores de equipo
    routeLayers.forEach(layer => map.removeLayer(layer));
    routeLayers = [];

    teamMarkers.forEach(marker => map.removeLayer(marker));
    teamMarkers = [];
};

// Mostrar notificación
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full opacity-0 transition-all duration-300 flex items-center gap-2';
    notification.innerHTML = `
        <i data-lucide="check-circle" class="w-5 h-5"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('translate-x-full', 'opacity-0');
        notification.classList.add('translate-x-0', 'opacity-100');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('translate-x-0', 'opacity-100');
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);

    if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons();
    }
}

// Exportar funciones necesarias
export default {
    initMap,
    showTeamSelector: window.showTeamSelector,
    showConfirmationModal: window.showConfirmationModal,
    confirmAssignment: window.confirmAssignment,
    cancelAssignment: window.cancelAssignment,
    closeInfoPanel: window.closeInfoPanel
};