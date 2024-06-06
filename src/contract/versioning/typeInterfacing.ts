import { ReactNode } from 'react'
export interface Web3ModalProviderProps {
    children: ReactNode
}
export interface saleInfoStruct {
    isTokenSaleActive: boolean
    maxSupply: string | number
    totalSupply: string | number
    tokenCost: number
    tokenUri: string
}
export interface traitStruct {
    trait_type: string
    value: string | number
}
export interface tokenStruct {
    name: string
    created_by?: string
    description?: string
    external_url?: string
    image: string
    animation_url?: string
    attributes?: [traitStruct]
}
export interface projectStruct {
    title: string
    creator: string
    desc: string
    mintPrice: number
    allTokens: [tokenStruct]
    imgURL: string
}

export interface galleryProps {
    allTokenSaleInfo: [saleInfoStruct]
    tokens: [tokenStruct]
    setSelectionIndex: (p: number) => void
    selectionIndex: number
}
export interface CardProps {
    token: tokenStruct
    saleInfo: saleInfoStruct
    tokenIndex: number
    setSelectionIndex: (p: number) => void
    selectionIndex: number
}
export interface selectionStruct {
    saleInfo: saleInfoStruct
    token: tokenStruct
}
export interface ControlProps {
    contractAddress: `0x${string}`
    selection: selectionStruct
    selectionIndex: number
}
export interface DisplayProps {
    contractAddress: `0x${string}`
    selection: selectionStruct
    selectionIndex: number
    setSelectionIndex: (p: number) => void
    numTokens: number
}
