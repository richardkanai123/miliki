const loading = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 animate-pulse ease-in-out">
                <div className="h-4 w-24 bg-muted rounded-full " />
                <div className="h-4 w-24 bg-muted rounded-full" />
            </div>
            <div className="flex flex-col gap-2"></div>
        </div>
    )
}

export default loading