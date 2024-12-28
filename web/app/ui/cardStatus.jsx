'use client';

import React, { useState } from 'react';

export default function CardStatus() {
    const statusOptions = [
        { id: 'ativado', label: 'Ativado (23)', color: 'border-gray-500 border-2' },
        { id: 'desativado', label: 'Desativado (17)', color: 'border-gray-500 border-2' },
        { id: 'manutencao', label: 'Manutenção (3)', color: 'border-gray-500 border-2' },
    ];

    const [selectedStatus, setSelectedStatus] = useState({});

    const toggleStatus = (id) => {
        setSelectedStatus((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="bg-white w-[288px] h-[143px] rounded-lg shadow p-4">
            {statusOptions.map(({ id, label, color }) => (
                <button
                    key={id}
                    onClick={() => toggleStatus(id)}
                    className={`flex items-center mb-0.5 p-0.5 rounded ${selectedStatus[id] ? 'bg-blue-100' : ''}`}
                >
                    <span className={`w-4 h-4 rounded mr-2 ${color}`}></span>
                    <span className="text-gray-700 font-semibold">{label}</span>
                </button>
            ))}
        </div>
    );
};
