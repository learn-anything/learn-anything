export const PageLoader = () => {
	return (
		<div className="relative top-[-60px] flex h-full flex-col justify-center">
			<div className="mx-auto w-full max-w-[220px] py-6">
				<div className="text-center">
					<div className="mb-4 text-base font-medium">Preparing application</div>
					<div className="bg-muted relative flex h-1 w-full appearance-none overflow-hidden rounded leading-3">
						<div className="progress-bar-indeterminate bg-primary flex h-full flex-col justify-center overflow-hidden whitespace-nowrap text-center text-white"></div>
					</div>
				</div>
			</div>
		</div>
	)
}
