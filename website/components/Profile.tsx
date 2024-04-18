import Icon from "../../shared/components/Icon"

export default function Profile() {
	return (
		<div class="">
			<div class="flex-between h-[74px] p-[20px]">
				<div class="text-[25px] font-bold">Profile</div>
				<div>Set</div>
			</div>
			<div class="px-[41px] p-[20px] flex gap-[40px]">
				<div class="w-[130px] h-[130px] border-dashed border rounded-[7px] border-white/10 bg-white bg-opacity-[0.02] flex-center text-white/40">
					<Icon name="Plus" />
				</div>
				<div class="col-gap-[20px]">
					<input
						type="text"
						placeholder="Your name"
						class="bg-[#121212] outline-none rounded-[7px] placeholder-white/20 w-[400px] px-[14px] p-[13px]"
					/>
					<div>
						<input
							type="text"
							placeholder="Username"
							class="bg-[#121212] outline-none rounded-[7px] placeholder-white/20  w-[400px] px-[14px] p-[13px]"
						/>
						<div class="text-[14px] pt-[10px] text-white/20">
							learn-anything.xyz/@
						</div>
					</div>
					<input
						type="text"
						placeholder="Website"
						class="bg-[#121212] outline-none rounded-[7px] placeholder-white/20  w-[400px] px-[14px] p-[13px]"
					/>
				</div>
			</div>
		</div>
	)
}
