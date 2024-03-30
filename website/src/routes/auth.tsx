export default function Auth() {
	return (
		<div class="w-screen h-screen flex-center ">
			<div class="border border-[#191919] p-[30px] py-[50px] rounded-[7px] w-[400px] bg-[#0F0F0F] col-gap-[40px]">
				<div class="text-[25px] text-center w-full">Welcome</div>
				<div class="col-gap-[16px]">
					<input
						type="text"
						style={{
							background:
								"linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.03) 100%), #191919",
							"box-shadow": "0px 4px 10px 0px rgba(0, 0, 0, 0.20)",
						}}
						placeholder="Enter Email"
						class="border w-full outline-none p-[14px] rounded-[7px] text-center text-white/30 text-[14px] border-white/10"
					/>
					<div class="w-full text-center text-[14px] text-white/40">or</div>
					<div
						style={{
							background:
								"linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.03) 100%), #191919",
							"box-shadow": "0px 4px 10px 0px rgba(0, 0, 0, 0.20)",
						}}
						class="border w-full outline-none p-[14px] rounded-[7px] text-center text-white/30 text-[14px] border-white/10"
					>
						Sign in with passkey
					</div>
				</div>
				<div class="text-[14px] text-white/30 text-center px-5">
					By clicking on either button, you agree to the terms of service
				</div>
			</div>
			<div class="absolute bottom-10 left-[50%] translate-x-[-50%] text-[14px] text-white/30">
				<div>learn Anything</div>
				<div></div>
			</div>
		</div>
	)
}
