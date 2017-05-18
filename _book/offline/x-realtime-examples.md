# Realtime Examples

## Replicate the entire file

```text
===== remoteService, before mutations
{dept: "a", stock: "a1", _id: "JdYINLVZkU70vcgL"}
{dept: "a", stock: "a2", _id: "X6ymJYOqYWLe3KHj"}
{dept: "a", stock: "a3", _id: "p1zZviQzhAed2jMd"}
{dept: "a", stock: "a4", _id: "cE9ujfWFHTjNh4px"}
{dept: "a", stock: "a5", _id: "fyyErGpn8Hk2Q5EY"}
===== clientService, before mutations
{dept: "a", stock: "a1", ___id: "JdYINLVZkU70vcgL", _id: "A29Urf0WmOfjV8W6"}
{dept: "a", stock: "a2", ___id: "X6ymJYOqYWLe3KHj", _id: "RuZlujc09it23Ikx"}
{dept: "a", stock: "a3", ___id: "p1zZviQzhAed2jMd", _id: "Y1SuSBXUB659vEWm"}
{dept: "a", stock: "a4", ___id: "cE9ujfWFHTjNh4px", _id: "I7s4gsQTFtUZPyUt"}
{dept: "a", stock: "a5", ___id: "fyyErGpn8Hk2Q5EY", _id: "agzsMMxP04EhMksH"}
===== mutate remoteService
remoteService.patch stock: a1
remoteService.create stock: a99
remoteService.remove stock: a2
===== remoteService, after mutations
{dept: "a", stock: "a1", _id: "JdYINLVZkU70vcgL", foo: 1}
{dept: "a", stock: "a3", _id: "p1zZviQzhAed2jMd"}
{dept: "a", stock: "a4", _id: "cE9ujfWFHTjNh4px"}
{dept: "a", stock: "a5", _id: "fyyErGpn8Hk2Q5EY"}
{dept: "a", stock: "a99", _id: "1VD0hWlkfaZdDBt0"}
===== clientService, after mutations
{dept: "a", stock: "a1", foo: 1, ___id: "JdYINLVZkU70vcgL", _id: "A29Urf0WmOfjV8W6"}
{dept: "a", stock: "a3", ___id: "p1zZviQzhAed2jMd", _id: "Y1SuSBXUB659vEWm"}
{dept: "a", stock: "a4", ___id: "cE9ujfWFHTjNh4px", _id: "I7s4gsQTFtUZPyUt"}
{dept: "a", stock: "a5", ___id: "fyyErGpn8Hk2Q5EY", _id: "agzsMMxP04EhMksH"}
{dept: "a", stock: "a99", ___id: "1VD0hWlkfaZdDBt0", _id: "NkBp4yXfitEauNh1"}
>>>>> disconnection from server
===== mutate remoteService
remoteService.patch stock: a3
remoteService.create stock: a98
remoteService.remove stock: a5
<<<<< reconnected to server
===== remoteService, after reconnection
{dept: "a", stock: "a1", _id: "JdYINLVZkU70vcgL", foo: 1}
{dept: "a", stock: "a3", _id: "p1zZviQzhAed2jMd", foo: 1}
{dept: "a", stock: "a4", _id: "cE9ujfWFHTjNh4px"}
{dept: "a", stock: "a98", _id: "zd7o0ulMagYjyGBo"}
{dept: "a", stock: "a99", _id: "1VD0hWlkfaZdDBt0"}
===== clientService, after reconnection
{dept: "a", stock: "a1", foo: 1, ___id: "JdYINLVZkU70vcgL", _id: "sQ8LYLXMO2wK8VQC"}
{dept: "a", stock: "a3", foo: 1, ___id: "p1zZviQzhAed2jMd", _id: "prAZ8yJjLJw0GAfG"}
{dept: "a", stock: "a4", ___id: "cE9ujfWFHTjNh4px", _id: "1M2xDGBpQL201hfK"}
{dept: "a", stock: "a98", ___id: "zd7o0ulMagYjyGBo", _id: "DgWgc3vA8z0fewaf"}
{dept: "a", stock: "a99", ___id: "1VD0hWlkfaZdDBt0", _id: "WAFFfnvvnTDaUDwi"}
===== Example finished.
```



## Replicate part of a file

```text
===== remoteService, before mutations
Object {dept: "a", stock: "a1", _id: "oXYki3eKCIfULIge"}
Object {dept: "a", stock: "a2", _id: "DVvUMzpEwhtLtYxg"}
Object {dept: "a", stock: "a3", _id: "k5qvFLKf7WVVr5UE"}
Object {dept: "a", stock: "a4", _id: "FqMgu80gxv1DdyHs"}
Object {dept: "a", stock: "a5", _id: "otJFp03djEuFX59R"}
Object {dept: "b", stock: "b1", _id: "lqeCPJ6k8iE2UerN"}
Object {dept: "b", stock: "b2", _id: "HEeGlMKvlPDj6K3x"}
Object {dept: "b", stock: "b3", _id: "Rab8IwKUo9s6QmK7"}
Object {dept: "b", stock: "b4", _id: "Ry81S3evrr0PEDs0"}
Object {dept: "b", stock: "b5", _id: "57cLF8GdIb9601fc"}
===== clientService, dept: a, before mutations
Object {dept: "a", stock: "a1", ___id: "oXYki3eKCIfULIge", _id: "zNMAs3M5qVunSIhj"}
Object {dept: "a", stock: "a2", ___id: "DVvUMzpEwhtLtYxg", _id: "xJYNmY5NCWtDywTg"}
Object {dept: "a", stock: "a3", ___id: "k5qvFLKf7WVVr5UE", _id: "dDV0PDLmQFonckzj"}
Object {dept: "a", stock: "a4", ___id: "FqMgu80gxv1DdyHs", _id: "enSfMT2c9tGKLXFr"}
Object {dept: "a", stock: "a5", ___id: "otJFp03djEuFX59R", _id: "tkDySDQP5P0XTzcn"}
===== mutate remoteService
remoteService.patch stock: a1 move to dept: b
remoteService.patch stock: b1 move to dept: a
===== remoteService, after mutations
Object {dept: "b", stock: "a1", _id: "oXYki3eKCIfULIge"}
Object {dept: "a", stock: "a2", _id: "DVvUMzpEwhtLtYxg"}
Object {dept: "a", stock: "a3", _id: "k5qvFLKf7WVVr5UE"}
Object {dept: "a", stock: "a4", _id: "FqMgu80gxv1DdyHs"}
Object {dept: "a", stock: "a5", _id: "otJFp03djEuFX59R"}
Object {dept: "a", stock: "b1", _id: "lqeCPJ6k8iE2UerN"}
Object {dept: "b", stock: "b2", _id: "HEeGlMKvlPDj6K3x"}
Object {dept: "b", stock: "b3", _id: "Rab8IwKUo9s6QmK7"}
Object {dept: "b", stock: "b4", _id: "Ry81S3evrr0PEDs0"}
Object {dept: "b", stock: "b5", _id: "57cLF8GdIb9601fc"}
===== clientService, dept a, after mutations
Object {dept: "a", stock: "a2", ___id: "DVvUMzpEwhtLtYxg", _id: "xJYNmY5NCWtDywTg"}
Object {dept: "a", stock: "a3", ___id: "k5qvFLKf7WVVr5UE", _id: "dDV0PDLmQFonckzj"}
Object {dept: "a", stock: "a4", ___id: "FqMgu80gxv1DdyHs", _id: "enSfMT2c9tGKLXFr"}
Object {dept: "a", stock: "a5", ___id: "otJFp03djEuFX59R", _id: "tkDySDQP5P0XTzcn"}
Object {dept: "a", stock: "b1", ___id: "lqeCPJ6k8iE2UerN", _id: "iYgsqQbCaS9IH78p"}
===== Example finished.
```



## Filter service events on server

```text
  rep:filter --- filter patch undefined +0ms
  rep:filter from { dept: 'a', stock: 'a1', _id: 'SOmYFH8pzebSWL6x' } +3ms
  rep:filter to   { dept: 'b', stock: 'a1', _id: 'SOmYFH8pzebSWL6x' } +3ms
  rep:filter NEED true false +1ms
  rep:filter --- filter patch undefined +7ms
  rep:filter from { dept: 'b', stock: 'b1', _id: 'sWTybSEdfXm8NQpu' } +1ms
  rep:filter to   { dept: 'a', stock: 'b1', _id: 'sWTybSEdfXm8NQpu' } +0ms
  rep:filter NEED false true +1ms
```

```text
===== remoteService, before mutations
{dept: "a", stock: "a1", _id: "SOmYFH8pzebSWL6x"}
{dept: "a", stock: "a2", _id: "iS9f6izecQYDXTUX"}
{dept: "a", stock: "a3", _id: "2SvWXmGW1cOME41N"}
{dept: "a", stock: "a4", _id: "QwaWzalVrS5cazxb"}
{dept: "a", stock: "a5", _id: "QBP0rw2sFbi9bwOO"}
{dept: "b", stock: "b1", _id: "sWTybSEdfXm8NQpu"}
{dept: "b", stock: "b2", _id: "RIALd3j3GR2LgTwZ"}
{dept: "b", stock: "b3", _id: "gpn0m08rUCYO5xk1"}
{dept: "b", stock: "b4", _id: "9VtLgDTVi5ExZ02i"}
{dept: "b", stock: "b5", _id: "MEoYiMGwJDnExaIa"}
===== clientService, dept: a, before mutations
{dept: "a", stock: "a1", ___id: "SOmYFH8pzebSWL6x", _id: "etz4iLVuJi1KgxZ9"}
{dept: "a", stock: "a2", ___id: "iS9f6izecQYDXTUX", _id: "qiMIDShK0URRrgkl"}
{dept: "a", stock: "a3", ___id: "2SvWXmGW1cOME41N", _id: "vkdFWfL5gsFkiOKz"}
{dept: "a", stock: "a4", ___id: "QwaWzalVrS5cazxb", _id: "kJ4fqU9RjDyRv8w8"}
{dept: "a", stock: "a5", ___id: "QBP0rw2sFbi9bwOO", _id: "ID5cpKOpzntTKFyJ"}
===== mutate remoteService
remoteService.patch stock: a1 move to dept: b
remoteService.patch stock: b1 move to dept: a
===== remoteService, after mutations
{dept: "b", stock: "a1", _id: "SOmYFH8pzebSWL6x"}
{dept: "a", stock: "a2", _id: "iS9f6izecQYDXTUX"}
{dept: "a", stock: "a3", _id: "2SvWXmGW1cOME41N"}
{dept: "a", stock: "a4", _id: "QwaWzalVrS5cazxb"}
{dept: "a", stock: "a5", _id: "QBP0rw2sFbi9bwOO"}
{dept: "a", stock: "b1", _id: "sWTybSEdfXm8NQpu"}
{dept: "b", stock: "b2", _id: "RIALd3j3GR2LgTwZ"}
{dept: "b", stock: "b3", _id: "gpn0m08rUCYO5xk1"}
{dept: "b", stock: "b4", _id: "9VtLgDTVi5ExZ02i"}
{dept: "b", stock: "b5", _id: "MEoYiMGwJDnExaIa"}
===== clientService, dept a, after mutations
{dept: "a", stock: "a2", ___id: "iS9f6izecQYDXTUX", _id: "qiMIDShK0URRrgkl"}
{dept: "a", stock: "a3", ___id: "2SvWXmGW1cOME41N", _id: "vkdFWfL5gsFkiOKz"}
{dept: "a", stock: "a4", ___id: "QwaWzalVrS5cazxb", _id: "kJ4fqU9RjDyRv8w8"}
{dept: "a", stock: "a5", ___id: "QBP0rw2sFbi9bwOO", _id: "ID5cpKOpzntTKFyJ"}
{dept: "a", stock: "b1", ___id: "sWTybSEdfXm8NQpu", _id: "df4m95W1Cf7uTQLI"}
===== Example finished.
```
