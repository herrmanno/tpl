export default interface Template {
    args: {
        name: string
        message?: string
        default?: string
        [key: string]: any
    }[]

    files(args: { [key: string]: string }): {
        name: string
        content: string
        trim?: boolean
        indent?: boolean
    }[]
}