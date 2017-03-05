module Main exposing (main)

import Html exposing (Html, div, input, text, select, option)
import Html.Attributes exposing (title, value, placeholder, name, id)
import Html.Events exposing (onInput, on)
import String
import Json.Decode
import Regex exposing (regex, contains)
import Cidr exposing (..)


main =
    Html.beginnerProgram
        { model = model
        , view = view
        , update = update
        }



-- MODEL


type alias Bitmask =
    { mask : String, bits : Int }


bitMask : Int -> Bitmask
bitMask x =
    Bitmask (Cidr.bits2mask x |> Cidr.int2ip4) x


bitMasks : List Bitmask
bitMasks =
    List.map bitMask <| List.reverse <| List.range 1 32


type alias Model =
    { ip : String
    , bits : Int
    }


model : Model
model =
    Model "" 0



-- UPDATE


type Msg
    = IpUpdated String
    | BitsUpdated String


update : Msg -> Model -> Model
update msg model =
    case msg of
        IpUpdated newIp ->
            { model | ip = newIp }

        BitsUpdated newBits ->
            { model | bits = String.toInt newBits |> Result.withDefault -1 }



-- VIEW


br =
    Html.br [] []


bitmask2option : Bitmask -> Html msg
bitmask2option bm =
    let
        stringBits =
            toString bm.bits
    in
        option [ title stringBits, value stringBits ] [ text <| stringBits ++ "   /    " ++ bm.mask ]


onChange tagger =
    Html.Events.on "change" (Json.Decode.map tagger Html.Events.targetValue)


view : Model -> Html Msg
view model =
    let
        bitMaskOptions =
            option [ value "" ] [ text "bits | mask" ]
                :: List.map bitmask2option bitMasks
    in
        div []
            [ text "CIDR Calculator"
            , br
            , input [ placeholder "1.2.3.4", onInput IpUpdated ] []
            , text " with "
            , select [ name "bits", title "bits", onChange BitsUpdated ] bitMaskOptions
            , br
            , br
            , div [ id "output", title "output" ] [ text (doCidr model) ]
            ]


doCidr model =
    if (isValidIp model.ip) && (model.bits >= 0) then
        let
            ( low, high ) =
                (cidr model.ip model.bits)
        in
            low ++ " - " ++ high
    else
        "invalid input"


isValidIp str =
    contains (regex "^(?!\\.)(\\.?[0-9]{1,3}){4}$") str
