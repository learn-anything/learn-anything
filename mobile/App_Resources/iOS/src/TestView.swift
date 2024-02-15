import SwiftUI
import SwiftDown

struct TestView: View {
    @State private var text: String = "\n\nThis is **bold** text, this is *italic* text, and this is ***bold, italic*** text.\n\n~~A strikethrough example~~\n\n`inline code`\n```\ncode block\n```\n\n\n[Learn about NativeScript](https://nativescript.org)"
    @State var previewText: AttributedString = AttributedString("")

  @FocusState private var focusedField: FocusField?

  var body: some View {
    VStack {
        SwiftDownEditor(text: $text, onTextChange: { newValue in
          updatePreviewText(value: newValue)

        })
        .autocapitalizationType(UITextAutocapitalizationType.none)
        .frame(maxWidth: .infinity, maxHeight: 300)
        .focused($focusedField, equals: .field)
        .onAppear {
            self.focusedField = .field
            updatePreviewText(value: text)
        }
        ScrollView {
            Text(previewText).frame(maxWidth: .infinity, minHeight: 300)
        }
        
      // Note: could try using this as well
      // TextEditor(text: $text)
    }.frame(maxWidth: .infinity, maxHeight: .infinity)
  }
    
    func updatePreviewText(value: String) {
        do {
          print("onTextChange")
          // previewText = LocalizedStringKey.init(text)
          previewText = try AttributedString(markdown: text, options: AttributedString.MarkdownParsingOptions(allowsExtendedAttributes: true, interpretedSyntax: .inlineOnlyPreservingWhitespace, failurePolicy: AttributedString.MarkdownParsingOptions.FailurePolicy.returnPartiallyParsedIfPossible))
        } catch {
          print("markdown parse error")
        }
    }
}

extension TestView {
  enum FocusField: Hashable {
    case field
  }
}


// NOTE: May want to use in future
// import HighlightedTextEditor

// // matches text between underscores
// let betweenUnderscores = try! NSRegularExpression(pattern: "_[^_]+_", options: [])

// struct TestView: View {
    
//     @State private var text: String = ""
    
//     private let rules: [HighlightRule] = [
//         HighlightRule(pattern: betweenUnderscores, formattingRules: [
//             TextFormattingRule(fontTraits: [.traitItalic, .traitBold]),
//             TextFormattingRule(key: .foregroundColor, value: UIColor.red),
//             TextFormattingRule(key: .underlineStyle) { content, range in
//                 if content.count > 10 { return NSUnderlineStyle.double.rawValue }
//                 else { return NSUnderlineStyle.single.rawValue }
//             }
//         ])
//     ]
    
//     var body: some View {
//         VStack {
//             HighlightedTextEditor(text: $text, highlightRules: rules)
//                 // optional modifiers
//                 .onCommit { print("commited") }
//                 .onEditingChanged { print("editing changed") }
//                 .onTextChange { print("latest text value", $0) }
//                 .onSelectionChange { (range: NSRange) in
//                     print(range)
//                 }
//                 .introspect { editor in
//                     // access underlying UITextView or NSTextView
//                     // editor.textView.backgroundColor = .green
//                 }
//         }.frame(maxWidth: .infinity, maxHeight: .infinity)
//     }
// }

