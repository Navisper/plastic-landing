// src/components/mapa-interactivo.js
// Sistema de gestión de recolección Plasticket - Versión Astro

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
    const teamAdjustments = [0.5, 0.8, 0.2, 0.7, 0.3];

    let distance = baseDistances[locationIndex] + teamAdjustments[teamIndex];
    distance += (Math.random() * 0.5 - 0.25);
    return Math.max(0.5, distance.toFixed(2));
}

// Inicializar mapa cuando el DOM esté listo
export function initMap() {
    // Crear el mapa
    map = L.map('map').setView([4.4389, -75.2322], 13);

    // Añadir capa de tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
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
                    <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
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
                <h3 class="font-bold text-green-700">${location.name}</h3>
                <p class="text-sm">${location.materialType} - ${location.weight}</p>
                <p class="text-xs text-gray-500">${location.applicantName}</p>
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
                <h4 class="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <i data-lucide="user" class="w-4 h-4"></i>
                    Información del Solicitante
                </h4>
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <p class="text-gray-500">Nombre</p>
                        <p class="font-medium">${location.applicantName}</p>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <p class="text-gray-500">Teléfono</p>
                        <p class="font-medium">${location.phone}</p>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-lg col-span-2">
                        <p class="text-gray-500">Correo Electrónico</p>
                        <p class="font-medium">${location.email}</p>
                    </div>
                </div>
            </div>
            
            <div>
                <h4 class="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <i data-lucide="map-pin" class="w-4 h-4"></i>
                    Dirección
                </h4>
                <div class="bg-gray-50 p-3 rounded-lg text-sm">
                    <p class="font-medium">${location.address}</p>
                    <p class="text-gray-500 mt-1">Ibagué, Tolima</p>
                </div>
            </div>
            
            <div class="pt-4 border-t">
                ${location.status === 'pendiente' ?
        `<div class="cursor-pointer" onclick="window.showTeamSelector()">
                        <div class="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                            <div class="flex items-center gap-2">
                                <i data-lucide="truck" class="w-5 h-5 text-green-600"></i>
                                <div>
                                    <span class="font-semibold text-gray-700">Asignar Equipo de Recolección</span>
                                    <p class="text-xs text-gray-500 mt-0.5">Haz clic para ver equipos disponibles</p>
                                </div>
                            </div>
                            <i data-lucide="chevron-down" class="w-4 h-4 text-gray-400"></i>
                        </div>
                        
                        <div id="teamSelector" class="hidden mt-4 space-y-3">
                            <h5 class="font-medium text-gray-700">Selecciona un equipo:</h5>
                            <!-- Las opciones se generarán dinámicamente -->
                        </div>
                    </div>`
        :
        `<div class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center gap-2">
                                <i data-lucide="check-circle" class="w-5 h-5 text-blue-600"></i>
                                <span class="font-semibold text-gray-700">Solicitud asignada</span>
                            </div>
                            <span class="px-2 py-1 bg-blue-500 text-white text-xs rounded">${location.assignedTeam || 'Equipo asignado'}</span>
                        </div>
                        <p class="text-sm text-gray-600">No se pueden hacer más asignaciones para esta solicitud</p>
                        <div class="mt-2 text-xs text-gray-500">
                            <p>📅 Asignado: ${location.assignedTime || new Date().toLocaleDateString()}</p>
                        </div>
                    </div>`
    }
            </div>
            
            <div class="text-xs text-gray-500 pt-4 border-t">
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

// Mostrar selector de equipos
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
            <div class="text-center py-4 border border-yellow-200 rounded-lg bg-yellow-50">
                <i data-lucide="alert-triangle" class="w-8 h-8 text-yellow-500 mx-auto mb-2"></i>
                <p class="font-medium text-yellow-700">No hay equipos disponibles</p>
                <p class="text-sm text-yellow-600 mt-1">Todos los equipos están ocupados o ya asignados</p>
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
        teamCard.className = 'border border-gray-200 rounded-lg p-3 hover:border-green-400 hover:bg-green-50 cursor-pointer transition-all';
        teamCard.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <h6 class="font-semibold text-gray-800">${team.name}</h6>
                    <p class="text-sm text-gray-600">${team.vehicle} • ${team.members} miembros</p>
                </div>
                <div class="text-right">
                    <p class="font-bold text-green-600">${distance} km</p>
                    <p class="text-xs text-gray-500">distancia</p>
                </div>
            </div>
            <div class="flex justify-between text-xs text-gray-600 mt-2">
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
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-md w-full transform transition-all">
            <div class="p-6">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <i data-lucide="alert-triangle" class="w-6 h-6 text-green-600"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-800 text-lg">Confirmar Asignación</h3>
                        <p class="text-gray-600 text-sm">¿Asignar esta solicitud al equipo seleccionado?</p>
                    </div>
                </div>
                
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg p-4 mb-6">
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-gray-500">Equipo asignado:</p>
                            <p class="font-semibold text-green-700">${team.name}</p>
                        </div>
                        <div>
                            <p class="text-gray-500">Distancia:</p>
                            <p class="font-semibold">${distance} km</p>
                        </div>
                        <div>
                            <p class="text-gray-500">Solicitudes hoy:</p>
                            <p class="font-semibold">${team.completedToday}</p>
                        </div>
                        <div>
                            <p class="text-gray-500">KG recolectados:</p>
                            <p class="font-semibold">${team.kgCollectedToday} kg</p>
                        </div>
                    </div>
                    <div class="mt-3 pt-3 border-t border-green-200">
                        <p class="text-gray-500 text-xs">Vehículo: ${team.vehicle}</p>
                        <p class="text-gray-500 text-xs">Miembros: ${team.members} personas</p>
                    </div>
                </div>
                
                <div class="flex gap-3">
                    <button onclick="window.confirmAssignment()" class="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-800 transition-all">
                        Sí, asignar equipo
                    </button>
                    <button onclick="window.cancelAssignment()" class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all">
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
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-xl border-3 border-white animate-pulse">
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
                <div class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <i data-lucide="check-circle" class="w-5 h-5 text-blue-600"></i>
                            <span class="font-semibold text-gray-700">Solicitud asignada</span>
                        </div>
                        <span class="px-2 py-1 bg-blue-500 text-white text-xs rounded">${selectedTeam.name}</span>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">Equipo asignado exitosamente</p>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <p class="text-gray-500">Vehículo:</p>
                            <p class="font-medium">${selectedTeam.vehicle}</p>
                        </div>
                        <div>
                            <p class="text-gray-500">Hora asignación:</p>
                            <p class="font-medium">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                    </div>
                    <div class="mt-3 pt-2 border-t border-blue-200">
                        <p class="text-xs text-gray-500">ID de asignación: ASG-${selectedLocation.id.toString().padStart(3, '0')}-${selectedTeam.id}</p>
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

// Funciones auxiliares para rutas (simplificadas para Astro)
async function drawOptimizedRoutes(start, end) {
    routeLayers.forEach(layer => map.removeLayer(layer));
    routeLayers = [];

    drawEnhancedSimulatedRoutes(start, end);
}

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

        const distance = calculateRouteDistance(points).toFixed(2);
        const time = Math.round(distance * 15);

        polyline.bindPopup(`
            <div class="p-3 min-w-[200px]">
                <h4 class="font-bold text-gray-800 mb-2">Ruta simulada ${i + 1}</h4>
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <i data-lucide="map" class="w-4 h-4 text-blue-500"></i>
                        <span class="text-sm">Distancia estimada: <strong>${distance} km</strong></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <i data-lucide="clock" class="w-4 h-4 text-green-500"></i>
                        <span class="text-sm">Tiempo estimado: <strong>${time} min</strong></span>
                    </div>
                </div>
            </div>
        `);

        routeLayers.push(polyline);
    }

    addRouteMarkers(start, end);
    adjustMapToRoutes(start, end);
}

function generateSmartRoute(start, end, routeIndex) {
    const points = [start];
    const numSegments = 10 + routeIndex * 3;

    const latDiff = end[0] - start[0];
    const lngDiff = end[1] - start[1];

    for (let j = 1; j < numSegments; j++) {
        const progress = j / numSegments;
        const t = progress;

        let lat, lng;

        switch(routeIndex) {
            case 0:
                lat = start[0] + latDiff * t;
                lng = start[1] + lngDiff * t;
                lat += Math.sin(t * Math.PI * 2) * 0.0003;
                lng += Math.cos(t * Math.PI * 2) * 0.0003;
                break;
            case 1:
                lat = start[0] + latDiff * (t + 0.1 * Math.sin(t * Math.PI));
                lng = start[1] + lngDiff * (t + 0.1 * Math.cos(t * Math.PI));
                lat += Math.sin(t * Math.PI * 3) * 0.0005;
                lng += Math.cos(t * Math.PI * 3) * 0.0005;
                break;
            case 2:
                lat = start[0] + latDiff * t;
                lng = start[1] + lngDiff * t;
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

function calculateRouteDistance(points) {
    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
        const lat1 = points[i][0], lng1 = points[i][1];
        const lat2 = points[i+1][0], lng2 = points[i+1][1];

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

function adjustMapToRoutes(start, end) {
    const bounds = L.latLngBounds([start, end]);

    routeLayers.forEach(layer => {
        try {
            bounds.extend(layer.getBounds());
        } catch (e) {
            if (layer.getLatLng) {
                bounds.extend(layer.getLatLng());
            }
        }
    });

    map.fitBounds(bounds, {
        padding: [100, 100],
        maxZoom: 16,
        animate: true,
        duration: 1.5
    });
}

function addRouteMarkers(start, end) {
    const truckIcon = L.divIcon({
        html: `
            <div class="relative">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-xl border-3 border-white animate-pulse">
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

    const recycleIcon = L.divIcon({
        html: `
            <div class="relative">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-700 rounded-full flex items-center justify-center shadow-xl border-3 border-white">
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

    const startMarker = L.marker(start, {
        icon: truckIcon,
        zIndexOffset: 1000
    }).addTo(map);

    const endMarker = L.marker(end, {
        icon: recycleIcon,
        zIndexOffset: 1000
    }).addTo(map);

    startMarker.bindPopup(`
        <div class="p-3">
            <h4 class="font-bold text-blue-600 mb-1">🏁 Punto de inicio</h4>
            <p class="text-sm">Equipo: <strong>${selectedTeam?.name || 'N/A'}</strong></p>
            <p class="text-sm">Vehículo: ${selectedTeam?.vehicle || 'N/A'}</p>
            <p class="text-xs text-gray-500">${selectedTeam?.members || 0} miembros</p>
        </div>
    `);

    endMarker.bindPopup(`
        <div class="p-3">
            <h4 class="font-bold text-green-600 mb-1">🎯 Punto de recolección</h4>
            <p class="text-sm">${selectedLocation?.name || 'N/A'}</p>
            <p class="text-sm">${selectedLocation?.materialType || 'N/A'} - ${selectedLocation?.weight || 'N/A'}</p>
            <p class="text-xs text-gray-500">${selectedLocation?.address || 'N/A'}</p>
        </div>
    `);

    routeLayers.push(startMarker, endMarker);

    setTimeout(() => {
        if (window.lucide && window.lucide.createIcons) {
            window.lucide.createIcons();
        }
    }, 100);
}

function updateTeamStats(teamId) {
    const team = teams.find(t => t.id === teamId);
    if (team && !team.lastAssignmentLocationId) {
        team.completedToday += 1;
        team.kgCollectedToday += parseInt(selectedLocation.weight) || 10;
        team.lastAssignmentLocationId = selectedLocation.id;

        const statsPanel = document.querySelector('.absolute.top-20.left-4');
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

// Exportar funciones necesarias
export default {
    initMap,
    showTeamSelector: window.showTeamSelector,
    showConfirmationModal: window.showConfirmationModal,
    confirmAssignment: window.confirmAssignment,
    cancelAssignment: window.cancelAssignment,
    closeInfoPanel: window.closeInfoPanel
};