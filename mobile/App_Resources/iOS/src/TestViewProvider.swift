import SwiftUI

@objc
class TestViewProvider: UIViewController, SwiftUIProvider {
  private var swiftUIView = TestView()

  required init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
  }

  required public init() {
    super.init(nibName: nil, bundle: nil)
  }

  public override func viewDidLoad() {
    super.viewDidLoad()
    setupSwiftUIView(content: swiftUIView)
  }

  func updateData(data: NSDictionary) {
    
  }

  var onEvent: ((NSDictionary) -> ())?
}
