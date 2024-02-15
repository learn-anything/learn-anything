declare class TestViewProvider extends UIViewController implements SwiftUIProvider {

	static alloc(): TestViewProvider; // inherited from NSObject

	static new(): TestViewProvider; // inherited from NSObject

	onEvent: (p1: NSDictionary<any, any>) => void; // inherited from SwiftUIProvider

	updateDataWithData(data: NSDictionary<any, any>): void;
}
