module Cidr exposing ( .. )
import Bitwise exposing (..)

ip42int : String -> Int
ip42int = String.split "."
  >> List.map (String.toInt >> Result.withDefault 0)
  >> List.foldl (\a b -> or (and a 0xff) (shiftLeftBy 8 b)) 0

bits2mask maskBits =
    shiftLeftBy (32 - maskBits) 0xffffffff

int2ip4 ip =
  String.join "." (List.map toString [
    shiftRightZfBy 24 ip |> and 0xff,
    shiftRightZfBy 16 ip |> and 0xff,
    shiftRightZfBy  8 ip |> and 0xff,
    and 0xff ip
  ])

cidr : String -> Int -> (String, String)
cidr ip bits = cidrCalc (ip42int ip) (bits2mask bits)

{-}    /**
     * @param {number} ip
     * @param {number}  mask
     * @returns {[string,string]}
     */
-}
cidrCalc : Int -> Int -> (String, String)
cidrCalc ip mask =
 (int2ip4 (and ip mask), int2ip4 (or ip (complement mask)))
