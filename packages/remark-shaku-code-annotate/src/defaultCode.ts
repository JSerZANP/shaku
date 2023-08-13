export const defaultCode = {
  abap: `
* @dim
REPORT Z_SAMPLE_REPORT.
REPORT Z_SAMPLE_REPORT.
*      ---------------
*           ^
*   [Hello World!]
`,
  "actionscript-3": `
package {
  // @dim
  import flash.display.Sprite;

  public class CommentExample extends Sprite {
    public function CommentExample() {
  //       --------
  //           ^
  // [Hello World!]
    }
  }
}
`,
  ada: `
-- @dim
with Ada.Text_IO;

procedure Comments_Example is
    -- This is a single-line comment
    --           -----------
    --              ^
    --  [Hello World!]
`,
  apache: `
# Virtual Host Configuration
<VirtualHost *:80>
    ServerName www.example.com
    DocumentRoot /var/www/html

    # This is a comment within a VirtualHost block.
    # It can provide additional information about the configuration of this specific virtual host.

    # Directory Configuration
    <Directory /var/www/html>
        Options FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>
</VirtualHost>
`,
  apex: `
public class ExampleClass {
  // @dim
  public void doSomething() {
      System.debug('Doing something...');
    //       -----
    //         ^
    // [Hello World!]
  }
}
`,
  apl: `
⍝ @dim
data ← 1 2 3 4 5

sum ← +/data
⍝     ------
⍝       ^
⍝  [Hello World!]

sum
`,
  applescript: `
-- @dim
display dialog "Hello, World!"
--      ------
--         ^
-- [Hello World!]
`,
  ara: `
// @dim
$foo = true;
$foo = true;
//     ----
//      ^
// [Hello!]
`,
  astro: `
<!-- @dim -->
<div>Hello World!</div>
{/* ^ */}
{/*[Hello!] */}

<div>Hello World!</div>
<!-- ----------- -->
<!-- ^ -->
<!--[Hello!] -->
`,
  awk: `
# @dim
sum = 0
sum = 1
#    --
#    ^
#[Hello!]
`,
  ballerina: `
//@dim
import ballerina/io;

public function main() {
  string message = "Hello, Ballerina!";
  //     -------
  //       ^
  // [Hello!]
}
`,
  batch: `
echo Batch Script Example
REM  -----
REM ^
REM [Hello World!]
`,
  berry: `
# @dim
def func(x)
  return x + 1.5
  #      -----
  #      ^
  #[Hello!]
end
`,
  bibtex: `
% @dim
% Another reference
%    ^
% [Hello!]
`,
  bicep: `
// @dim
// Define a storage
    // ----
// ^
//[Hello!]
`,
  blade: `
<h1>Welcome to our website!</h1>
{{--        ---- --}}
{{-- ^ --}}
{{-- [Hello World!] --}}
`,
  cadence: `
  // @dim
fun add(a: Int, b: Int): Int {
  //---
  // ^
  //[Hello!]
  return a + b
}
`,
  clarity: `
;;   @dim
;; This is a single-line comment 
;; ---
;; ^
;;[Hello!]
`,
  clojure: `
;   @dim
; This is a single-line comment 
; ---
; ^
;[Hello!]
`,
  cmake: `
# @dim
# This is a single-line comment
# ----
#  ^
#[Hello!]
  
`,
  asm: `
; @dim
section .data
    message db 'Hello, World!', 0
;   -------
;     ^
; [Hello World!]
  
`,
  c: `
// @dim
#include <stdio.h>

int main() {
    int x = 10;
//  -----------
//    ^
// [Hello World!]
    return 0;
}
`,
  cobol: `
* @dim
ENVIRONMENT DIVISION.
DATA DIVISION.
*    --------
*   ^
* [Hello World!]
`,
  coffee: `
# @dim
# coffee
#  ^
# [Hello!]
`,
  crystal: `
# @dim
# coffee
  # ^
# [Hello!]
`,
  css: `
.a {
  /* hello */
/*    --- */
/*    ^  */
/*  [Hello!]  */
}
`,
  cue: `
// @dim
// This is a configuration
//   -----
//    ^
// [Hello!]
`,
  d: `
// @dim
// This is a configuration
//   -----
//    ^
// [Hello!]
`,
  dart: `
// @dim
// This is a configuration
//   -----
//    ^
// [Hello!]
`,
  dax: `
// @dim
// This is a configuration
//   -----
//    ^
// [Hello!]
`,
  dockerfile: `
# @dim
FROM node:14
#---
  # ^
# [Hello!]
`,
  "dream-maker": `
// @dim
// This is a configuration
//   -----
//    ^
// [Hello!] 
`,
  elixir: `
# @dim
# coffee
# ------
  # ^
# [Hello!]
`,
  elm: `
-- @dim
-- coffee
-- ------
  -- ^
-- [Hello!]
`,
  erb: `
<h1>Welcome to our website!</h1>
<%#            --- %>
<%#     ^ %>
<%# [Hello World!] %>
`,
  erlang: `
%%      @dim
-export([add/2]).
%%      -------
%%      ^
%% [Hello World!]
`,
  fish: `
# @dim
# coffee
# ------
  # ^
# [Hello!]
`,
  "f#": `
// @dim
// coffee
// ------
  // ^
// [Hello!]
`,
  "git-commit": `
# @dim
# coffee
# ------
# ^
# [Hello!]
`,
  glsl: `
// @dim
// coffee
// ------
  // ^
// [Hello!]
`,
  gnuplot: `
# @dim
# coffee
# ------
 # ^
# [Hello!]
`,
  graphql: `
# @dim
type Query {
  #  -----
  #    ^
# [Hello world!]
}
`,
  groovy: `
// @dim
// coffee
// ------
  // ^
// [Hello!]
`,
  hack: `
<?hh
// @dim
    echo "hello";
//  ----
//   ^
// [Hello!]  
?>
`,
  haml: `
!!!
%html
  %head
    %title My HAML Page
-# @dim
  %body
    %h1 Welcome to My HAML Page
    -#  -------
    -# ^
    -#[Hello World!]
`,
  handlebars: `
{{!-- @dim --}}
<h1>{{pageTitle}}</h1>
{{!-- --------- --}}
{{!-- ^ --}}
{{!-- [Hello World!] --}}
`,
  haskell: `
-- @dim
-- This is a single-line
--      ---
--      ^
-- [Hello World!]
`,
  hcl: `
# @dim
# coffee
# ------
 # ^
# [Hello!]
  `,
  hlsl: `
// @dim
// coffee
// ------
  // ^
// [Hello!]
  `,
  html: `
<!-- @dim -->
<p>coffeee</p>   
<!-- ----- -->
<!--  ^ -->
<!-- [Hello ] -->
  `,
  cpp: `
// @dim
#include <iostream>

int main() {
  int x = 10;
  //  -----------
  //    ^
  // [Hello World!]
  return 0;
}
`,
  "c#": `
// @dim
using System;
namespace CommentExample
{
  // @highlight
  class Program
  {
    static void Main(string[] args)
    {
      int x = 10
    //----------
    // ^
    //[Hello World!]
    }

  }
}
`,
  go: `
// @dim
package main
import "fmt"
func main() {
  variable := 10
//--------
//      ^
//[Hello World!]
}
`,
  java: `
// @dim
public class CommentExample {
  public static void main(String[] args) {
    int x = 10;
//  ----------
//       ^
//[Hello world!]
    int square = x * x;
  }
}
`,
  javascript: `// @dim
import { useState } from 'react';

export default function Counter() {
  // @highlight
  const [count, setCount] = useState(0);
              //~~~~~~~~

  function handleClick() {
    setCount(count + 1);
  //-------------------
  //     ^
  //[Underline and callout!]
  }

  return (
    <button onClick={handleClick}>
    {/*       ^           */}
    {/* [Supports JSX] */}
    {/* [Awesome,right?] */}
      You pressed me {count} times
    </button>
  );
}`,
  julia: `
# @dim
variable = 1

variable = 10 
#          --
#          ^
# [Hello World]
`,
  matlab: `
% @dim
% This is a single-line comment in MATLAB.

variable = 10; 
%          --
  %        ^
  % [Hello World!]
`,
  php: `
// @dim
<?php
$variable = 10000;
//          --
//          ^
// [Hello world!]
// @dim
?>
`,
  r: `
# @dim
# Variables
variable <- 123
#        --
#        ^
# [Hello World!]
`,

  python: `
# @dim
def greet(name):
    print(f"Hello, {name}!")
  # -----
  #   ^
  # [Hello world!]
`,
  ruby: `
# @dim
square = variable * variable 
#        --------
#        ^
#   [Hello World!]
`,
  rust: `
// @dim
fn main() {
  let square = variable * variable; 
  //           --------
  //              ^
  //      [Hello World!]
}
  `,
  sql: `
-- Create a new table to store customer information
CREATE TABLE Customers (
  -- @dim
    CustomerID INT PRIMARY KEY,
    FirstName VARCHAR(50),
  --          -------
  --             ^
  --     [Hello World!]
    LastName VARCHAR(50)
);
`,
  swift: `
// @dim
import Foundation

var variable = 10 
//           ----
//            ^
// [Hello world!]
`,
  vb: `
Imports System
' @dim
Namespace CommentExample
    Class Program
        ' @highlight
        Sub Main()
            Dim x As Integer = 10
        '   -----
        '    ^
        ' [Hello world!]
        End Sub
    End Class
End Namespace
`,
};
