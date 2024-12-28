"use client";

import { useState } from "react";

const PublishButton = ({ className }) => {
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    setLoading(true);

    const url = `https://localhost:7299/api/Mqtt/publish?topic=compressor_maintence&message=ON`;

    try {
      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Erro no servidor: ${response.statusText}`);
      }

      const data = await response.text();
      alert(`Mensagem publicada: ${data}`);
    } catch (error) {
      alert(`Erro ao publicar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePublish}
      className={`${className}`}
      disabled={loading}
    >
      {loading ? "Enviando..." : "Ativar Modo de Manutenção"}
    </button>
  );
};

export default PublishButton;