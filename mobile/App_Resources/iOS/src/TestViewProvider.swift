import SwiftUI


@objc
class TestViewProvider: UIViewController, SwiftUIProvider {



  required init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
  }

  required public init() {
    super.init(nibName: nil, bundle: nil)
  }

  public override func viewDidLoad() {
    super.viewDidLoad()

  }



  private var swiftUIView = TestView()


  func updateData(data: NSDictionary) {
    setupSwiftUIView(content: swiftUIView)
  }


  var onEvent: ((NSDictionary) -> ())?
}
