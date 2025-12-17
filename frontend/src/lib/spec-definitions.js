export const COMPONENT_SPECS = {
    'Processeurs': [
        { key: 'socket', label: 'Socket', type: 'text', placeholder: 'e.g., LGA1700, AM5' },
        { key: 'cores', label: 'Cores', type: 'number', placeholder: 'e.g., 16' },
        { key: 'threads', label: 'Threads', type: 'number', placeholder: 'e.g., 24' },
        { key: 'baseClock', label: 'Base Clock', type: 'text', placeholder: 'e.g., 3.4 GHz' },
        { key: 'boostClock', label: 'Boost Clock', type: 'text', placeholder: 'e.g., 5.4 GHz' },
        { key: 'tdp', label: 'TDP', type: 'text', placeholder: 'e.g., 125W' },
        { key: 'cache', label: 'Cache', type: 'text', placeholder: 'e.g., 30MB L3' },
        { key: 'integratedGraphics', label: 'Integrated Graphics', type: 'text', placeholder: 'e.g., UHD 770' }
    ],
    'Cartes Graphiques': [
        { key: 'vram', label: 'VRAM Size', type: 'text', placeholder: 'e.g., 16GB' },
        { key: 'vramType', label: 'VRAM Type', type: 'text', placeholder: 'e.g., GDDR6X' },
        { key: 'busWidth', label: 'Bus Width', type: 'text', placeholder: 'e.g., 256-bit' },
        { key: 'coreClock', label: 'Core Clock', type: 'text', placeholder: 'e.g., 2235 MHz' },
        { key: 'interface', label: 'Interface', type: 'text', placeholder: 'e.g., PCIe 4.0 x16' },
        { key: 'length', label: 'Length', type: 'text', placeholder: 'e.g., 310 mm' },
        { key: 'tdp', label: 'TDP', type: 'text', placeholder: 'e.g., 320W' },
        { key: 'outputs', label: 'Outputs', type: 'text', placeholder: 'e.g., 3x DP 1.4, 1x HDMI 2.1' }
    ],
    'Cartes Mères': [
        { key: 'socket', label: 'Socket', type: 'text', placeholder: 'e.g., LGA1700' },
        { key: 'chipset', label: 'Chipset', type: 'text', placeholder: 'e.g., Z790' },
        { key: 'formFactor', label: 'Form Factor', type: 'text', placeholder: 'e.g., ATX' },
        { key: 'memoryType', label: 'Memory Type', type: 'text', placeholder: 'e.g., DDR5' },
        { key: 'memorySlots', label: 'Memory Slots', type: 'number', placeholder: 'e.g., 4' },
        { key: 'maxMemory', label: 'Max Memory', type: 'text', placeholder: 'e.g., 128GB' },
        { key: 'm2Slots', label: 'M.2 Slots', type: 'number', placeholder: 'e.g., 4' },
        { key: 'wifi', label: 'Wi-Fi/Bluetooth', type: 'text', placeholder: 'e.g., Wi-Fi 6E' }
    ],
    'Mémoire RAM': [
        { key: 'capacity', label: 'Capacity', type: 'text', placeholder: 'e.g., 32GB (2x16GB)' },
        { key: 'type', label: 'Type', type: 'text', placeholder: 'e.g., DDR5' },
        { key: 'speed', label: 'Speed', type: 'text', placeholder: 'e.g., 6000 MHz' },
        { key: 'casLatency', label: 'CAS Latency', type: 'text', placeholder: 'e.g., CL30' },
        { key: 'voltage', label: 'Voltage', type: 'text', placeholder: 'e.g., 1.35V' },
        { key: 'rgb', label: 'RGB', type: 'boolean', placeholder: '' }
    ],
    'Stockage': [
        { key: 'capacity', label: 'Capacity', type: 'text', placeholder: 'e.g., 2TB' },
        { key: 'type', label: 'Type', type: 'text', placeholder: 'e.g., NVMe SSD' },
        { key: 'interface', label: 'Interface', type: 'text', placeholder: 'e.g., PCIe 4.0' },
        { key: 'readSpeed', label: 'Read Speed', type: 'text', placeholder: 'e.g., 7300 MB/s' },
        { key: 'writeSpeed', label: 'Write Speed', type: 'text', placeholder: 'e.g., 6000 MB/s' },
        { key: 'formFactor', label: 'Form Factor', type: 'text', placeholder: 'e.g., M.2 2280' }
    ],
    'Alimentation': [
        { key: 'wattage', label: 'Wattage', type: 'text', placeholder: 'e.g., 850W' },
        { key: 'efficiency', label: 'Efficiency', type: 'text', placeholder: 'e.g., 80+ Gold' },
        { key: 'modularity', label: 'Modularity', type: 'text', placeholder: 'e.g., Fully Modular' },
        { key: 'formFactor', label: 'Form Factor', type: 'text', placeholder: 'e.g., ATX' }
    ],
    'Boîtiers': [
        { key: 'type', label: 'Type', type: 'text', placeholder: 'e.g., Mid Tower' },
        { key: 'motherboardSupport', label: 'MB Support', type: 'text', placeholder: 'e.g., ATX, mATX, ITX' },
        { key: 'maxGpuLength', label: 'Max GPU Length', type: 'text', placeholder: 'e.g., 400 mm' },
        { key: 'maxCpuCoolerHeight', label: 'Max CPU Cooler', type: 'text', placeholder: 'e.g., 170 mm' },
        { key: 'includedFans', label: 'Included Fans', type: 'text', placeholder: 'e.g., 3x 120mm ARGB' },
        { key: 'radiatorSupport', label: 'Radiator Support', type: 'text', placeholder: 'e.g., Up to 360mm Top/Front' }
    ]
};
