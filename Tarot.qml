import QtQuick
import Quickshell
import Quickshell.Io
import qs.Commons
import qs.Ui
import "deck.js" as Deck

// Tarot card of the day. The draw is seeded by the local date, so the card
// stays the same all day and changes at midnight. The popup shows the real
// 1909 Rider–Waite–Smith picture from cards/, loaded only while it's open;
// nothing runs besides a once-a-minute date check.
BarWidget {
  id: root
  moduleName: "reva.tarot"

  readonly property bool showName: setting("showName", true)
  readonly property bool reversals: setting("reversals", true)
  readonly property real maxLabelWidth: setting("maxLabelWidth", 140)

  property string today: dateKey()
  readonly property var draw: Deck.drawFor(today, reversals)
  readonly property var card: draw.card
  readonly property bool reversed: draw.reversed
  readonly property string keywords: reversed ? card.reversed : card.upright
  readonly property string reading: reversed ? card.reversedText : card.uprightText

  property bool popupOpen: false
  function close() { popupOpen = false }

  implicitWidth: vertical ? barSize : row.implicitWidth + Style.space(14)
  implicitHeight: vertical ? barGlyph.implicitHeight + Style.space(10) : barSize

  function dateKey() {
    return Qt.formatDate(new Date(), "yyyy-MM-dd")
  }

  function glyph(codepoint) {
    return codepoint ? String.fromCodePoint(codepoint) : ""
  }

  function arcanaLine() {
    if (card.major) return "Major Arcana · " + card.numeral
    return "Minor Arcana · " + card.suitName + " · " + card.element
  }

  function tooltipText() {
    return card.name + (reversed ? " (reversed)" : "") + " — " + keywords
  }

  // Cheap enough to poll, and unlike a timer aimed at midnight it also
  // catches the date changing while the machine was suspended.
  Timer {
    interval: 60000
    running: true
    repeat: true
    onTriggered: root.today = root.dateKey()
  }

  onPopupOpenChanged: if (popupOpen) today = dateKey()

  // `omarchy-shell reva.tarot toggle`, e.g. from a keybinding.
  IpcHandler {
    target: "reva.tarot"

    function toggle(): void {
      root.popupOpen = !root.popupOpen
    }
  }

  // A card face: the numeral at the top, the art in the middle and the name
  // at the bottom. Majors and aces get one large glyph, numbered cards get
  // pips, and court cards get a chess piece over the suit. Reversed cards are
  // turned upside down, as they'd lie on the table.
  component CardFace: Rectangle {
    id: face
    property var card: null
    property bool flipped: false
    readonly property color ink: Color.accent
    readonly property var rows: card ? Deck.pipRows(card) : []
    readonly property int widestRow: Math.max.apply(null, rows.concat([0]))
    readonly property real pipSize: Style.space(widestRow >= 4 ? 18 : 22)

    rotation: flipped ? 180 : 0
    radius: Style.space(8)
    color: Qt.tint(Color.popups.background, Qt.rgba(ink.r, ink.g, ink.b, 0.10))
    border.width: Math.max(1, Style.space(2))
    border.color: ink

    Rectangle {
      anchors.fill: parent
      anchors.margins: Style.space(5)
      radius: Style.space(5)
      color: "transparent"
      border.width: 1
      border.color: Qt.rgba(face.ink.r, face.ink.g, face.ink.b, 0.45)
    }

    Text {
      id: numeral
      anchors.top: parent.top
      anchors.topMargin: Style.space(10)
      anchors.horizontalCenter: parent.horizontalCenter
      textFormat: Text.PlainText
      text: face.card ? face.card.numeral : ""
      color: face.ink
      font.family: root.bar.fontFamily
      font.pixelSize: Style.font.bodySmall
      font.bold: true
    }

    Item {
      id: art
      anchors.left: parent.left
      anchors.right: parent.right
      anchors.top: numeral.bottom
      anchors.bottom: nameLabel.top
      anchors.margins: Style.space(10)

      Text {
        anchors.centerIn: parent
        visible: face.card !== null && (face.card.major || face.card.number === 1)
        textFormat: Text.PlainText
        text: face.card ? root.glyph(face.card.glyph) : ""
        rotation: face.card ? face.card.glyphRotation : 0
        color: face.ink
        font.family: root.bar.fontFamily
        font.pixelSize: Style.space(52)
      }

      Column {
        anchors.centerIn: parent
        visible: face.card !== null && face.card.courtGlyph !== 0
        spacing: Style.space(2)

        Text {
          anchors.horizontalCenter: parent.horizontalCenter
          textFormat: Text.PlainText
          text: face.card ? root.glyph(face.card.courtGlyph) : ""
          color: face.ink
          font.family: root.bar.fontFamily
          font.pixelSize: Style.space(44)
        }

        Text {
          anchors.horizontalCenter: parent.horizontalCenter
          textFormat: Text.PlainText
          text: face.card ? root.glyph(face.card.glyph) : ""
          color: face.ink
          font.family: root.bar.fontFamily
          font.pixelSize: Style.space(22)
        }
      }

      Column {
        anchors.centerIn: parent
        spacing: Style.space(4)

        Repeater {
          model: face.rows

          Row {
            required property int modelData
            anchors.horizontalCenter: parent.horizontalCenter
            spacing: Style.space(4)

            Repeater {
              model: parent.modelData

              Text {
                textFormat: Text.PlainText
                text: face.card ? root.glyph(face.card.glyph) : ""
                color: face.ink
                font.family: root.bar.fontFamily
                font.pixelSize: face.pipSize
              }
            }
          }
        }
      }
    }

    Text {
      id: nameLabel
      anchors.left: parent.left
      anchors.right: parent.right
      anchors.bottom: parent.bottom
      anchors.margins: Style.space(10)
      textFormat: Text.PlainText
      text: face.card ? face.card.name.toUpperCase() : ""
      color: face.ink
      font.family: root.bar.fontFamily
      font.pixelSize: Style.font.caption
      font.bold: true
      horizontalAlignment: Text.AlignHCenter
      wrapMode: Text.WordWrap
      maximumLineCount: 2
      elide: Text.ElideRight
    }
  }

  Row {
    id: row
    anchors.centerIn: parent
    spacing: Style.space(6)

    Text {
      id: barGlyph
      anchors.verticalCenter: parent.verticalCenter
      textFormat: Text.PlainText
      text: root.glyph(root.card.glyph)
      rotation: (root.reversed ? 180 : 0) + root.card.glyphRotation
      color: root.bar.barForeground
      font.family: root.bar.fontFamily
      font.pixelSize: Style.font.icon
    }

    Text {
      anchors.verticalCenter: parent.verticalCenter
      visible: root.showName && !root.vertical
      width: Math.min(root.maxLabelWidth, implicitWidth)
      textFormat: Text.PlainText
      text: root.card.name
      color: root.bar.barForeground
      font.family: root.bar.fontFamily
      font.pixelSize: Style.font.body
      elide: Text.ElideRight
    }
  }

  MouseArea {
    anchors.fill: parent
    hoverEnabled: true
    cursorShape: Qt.PointingHandCursor
    acceptedButtons: Qt.LeftButton | Qt.RightButton
    onClicked: root.popupOpen = !root.popupOpen
    onEntered: root.bar.showTooltip(root, root.tooltipText())
    onExited: root.bar.hideTooltip(root)
  }

  PopupCard {
    id: popup
    anchorItem: root
    bar: root.bar
    owner: root
    open: root.popupOpen
    contentWidth: popup.fittedContentWidth(Style.space(420))
    contentHeight: popup.fittedContentHeight(Math.max(cardSlot.height, details.implicitHeight))

    Row {
      anchors.fill: parent
      spacing: Style.space(14)

      // The real card picture, upside down when reversed. The glyph face
      // only shows if the picture is missing or fails to load.
      Item {
        id: cardSlot
        width: Style.space(150)
        height: Style.space(260)
        rotation: root.reversed ? 180 : 0

        Rectangle {
          anchors.fill: parent
          visible: cardImage.status === Image.Ready
          radius: Style.space(6)
          color: "transparent"
          border.width: Math.max(1, Style.space(2))
          border.color: Color.accent

          Image {
            id: cardImage
            anchors.fill: parent
            anchors.margins: Style.space(3)
            fillMode: Image.PreserveAspectCrop
            asynchronous: true
            smooth: true
            mipmap: true
            sourceSize.width: Style.space(300)
            source: popup.visible ? Qt.resolvedUrl("cards/" + root.card.image) : ""
          }
        }

        CardFace {
          anchors.fill: parent
          visible: cardImage.status === Image.Error
          card: root.card
        }
      }

      Column {
        id: details
        width: parent.width - cardSlot.width - parent.spacing
        spacing: Style.space(6)

        Text {
          width: parent.width
          textFormat: Text.PlainText
          text: root.card.name
          color: root.bar.foreground
          font.family: root.bar.fontFamily
          font.pixelSize: Style.font.title
          font.bold: true
          wrapMode: Text.WordWrap
        }

        Text {
          width: parent.width
          textFormat: Text.PlainText
          text: root.arcanaLine()
          color: Qt.darker(root.bar.foreground, 1.5)
          font.family: root.bar.fontFamily
          font.pixelSize: Style.font.caption
          wrapMode: Text.WordWrap
        }

        Text {
          textFormat: Text.PlainText
          text: (root.reversed ? "󰁅 " : "󰁝 ") + (root.reversed ? "Reversed" : "Upright")
          color: Color.accent
          font.family: root.bar.fontFamily
          font.pixelSize: Style.font.bodySmall
          font.bold: true
        }

        Text {
          width: parent.width
          textFormat: Text.PlainText
          text: root.keywords
          color: Qt.darker(root.bar.foreground, 1.15)
          font.family: root.bar.fontFamily
          font.pixelSize: Style.font.bodySmall
          font.italic: true
          wrapMode: Text.WordWrap
        }

        Text {
          width: parent.width
          textFormat: Text.PlainText
          text: root.reading
          color: root.bar.foreground
          font.family: root.bar.fontFamily
          font.pixelSize: Style.font.body
          wrapMode: Text.WordWrap
          lineHeight: 1.15
        }

        Text {
          width: parent.width
          topPadding: Style.space(4)
          textFormat: Text.PlainText
          text: Qt.formatDate(new Date(root.today + "T12:00:00"), "dddd d MMMM") + " · a new card at midnight"
          color: Qt.darker(root.bar.foreground, 1.6)
          font.family: root.bar.fontFamily
          font.pixelSize: Style.font.caption
          wrapMode: Text.WordWrap
        }
      }
    }
  }
}
