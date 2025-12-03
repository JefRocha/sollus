"use client"

import { useState, useEffect } from "react"

/**
 * Hook para detectar se a aplicação está sendo visualizada em um dispositivo mobile
 * Breakpoint: 768px (tablet/mobile)
 */
export function useMobileDetection() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        // Função para verificar se é mobile
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        // Verificar no mount
        checkIsMobile()

        // Adicionar listener para mudanças de tamanho
        window.addEventListener("resize", checkIsMobile)

        // Cleanup
        return () => window.removeEventListener("resize", checkIsMobile)
    }, [])

    return { isMobile }
}
