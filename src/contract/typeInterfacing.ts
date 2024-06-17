import { ReactNode } from 'react'
export interface Web3ModalProviderProps {
    children: ReactNode
}
export interface saleInfoStruct {
    isTokenSaleActive: boolean
    currentSupply: string | number
    maxSupply: string | number
    totalSupply: string | number
    tokenCost: number
    tokenUri: string
}
export interface traitStruct {
    trait_type: string
    value: string | number
}
export interface currencyStruct {
    symbol: string
}
export interface tokenStruct {
    name: string
    created_by?: string
    description?: string
    external_url?: string
    image: string
    animation_url?: string
    attributes?: [traitStruct]
    is_token_sale_active: boolean
    max_supply: string | number
    current_supply: string | number
    token_cost: number
    uri: string
    currency_address?: string
    currency_details: currencyStruct
}
export interface projectStruct {
    title: string
    creator: string
    desc: string
    tokens: tokenStruct[]
    currency: any
}

export interface galleryProps {
    allTokens: [tokenStruct]
    tokens: [tokenStruct]
    setSelectionIndex: (p: number) => void
    selectionIndex: number
}
export interface CardProps {
    token: tokenStruct
    tokenIndex: number
    setSelectionIndex: (p: number) => void
    selectionIndex: number
}
export interface ControlProps {
    contractAddress: `0x${string}`
    selection: tokenStruct
    selectionIndex: number
}
export interface DisplayProps {
    contractAddress: string
    selection: tokenStruct
    selectionIndex: number
    setSelectionIndex: (p: number) => void
    numTokens: number
}
export interface currencyStruct {
    symbol: string
    decimals: number
    name: string
}
