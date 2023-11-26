export const defaultCode = {
  abap: `
* @highlight
REPORT Z_SAMPLE_REPORT.
REPORT Z_SAMPLE_REPORT.
*      ---------------
*           ^
*   [Hello World!]
`,
  "actionscript-3": `
package {
  // @highlight
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
-- @highlight
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
  // @highlight
  public void doSomething() {
      System.debug('Doing something...');
    //       -----
    //         ^
    // [Hello World!]
  }
}
`,
  apl: `
⍝ @highlight
data ← 1 2 3 4 5

sum ← +/data
⍝     ------
⍝       ^
⍝  [Hello World!]

sum
`,
  applescript: `
-- @highlight
display dialog "Hello, World!"
--      ------
--         ^
-- [Hello World!]
`,
  ara: `
// @highlight
$foo = true;
$foo = true;
//     ----
//      ^
// [Hello!]
`,
  astro: `
---
import { Button } from 'Button'
---
<!-- @highlight -->
<div>Hello World!</div>
{/* ^ */}
{/*[Hello!] */}

<div>Hello World!</div>
<!-- ----------- -->
<!-- ^ -->
<!--[Hello!] -->
`,
  awk: `
# @highlight
sum = 0
sum = 1
#    --
#    ^
#[Hello!]
`,
  ballerina: `
//@highlight
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
# @highlight
def func(x)
  return x + 1.5
  #      -----
  #      ^
  #[Hello!]
end
`,
  //   bibtex: `
  // % @highlight
  // % Another reference
  // %    ^
  // % [Hello!]
  // `,
  bicep: `
// @highlight
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
  // @highlight
fun add(a: Int, b: Int): Int {
  //---
  // ^
  //[Hello!]
  return a + b
}
`,
  clarity: `
;;   @highlight
;; This is a single-line comment 
;; ---
;; ^
;;[Hello!]
`,
  clojure: `
;   @highlight
; This is a single-line comment 
; ---
; ^
;[Hello!]
`,
  cmake: `
# @highlight
# This is a single-line comment
# ----
#  ^
#[Hello!]
  
`,
  asm: `
; @highlight
section .data
    message db 'Hello, World!', 0
;   -------
;     ^
; [Hello World!]
  
`,
  c: `
// @highlight
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
* @highlight
ENVIRONMENT DIVISION.
DATA DIVISION.
*    --------
*   ^
* [Hello World!]
`,
  coffee: `
# @highlight
# coffee
#  ^
# [Hello!]
`,
  crystal: `
# @highlight
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
// @highlight
// This is a configuration
//   -----
//    ^
// [Hello!]
`,
  d: `
// @highlight
// This is a configuration
//   -----
//    ^
// [Hello!]
`,
  dart: `
// @highlight
// This is a configuration
//   -----
//    ^
// [Hello!]
`,
  dax: `
// @highlight
// This is a configuration
//   -----
//    ^
// [Hello!]
`,
  dockerfile: `
# @highlight
FROM node:14
#---
  # ^
# [Hello!]
`,
  "dream-maker": `
// @highlight
// This is a configuration
//   -----
//    ^
// [Hello!] 
`,
  elixir: `
# @highlight
# coffee
# ------
  # ^
# [Hello!]
`,
  elm: `
-- @highlight
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
%%      @highlight
-export([add/2]).
%%      -------
%%      ^
%% [Hello World!]
`,
  fish: `
# @highlight
# coffee
# ------
  # ^
# [Hello!]
`,
  "f#": `
// @highlight
// coffee
// ------
  // ^
// [Hello!]
`,
  "git-commit": `
# @highlight
# coffee
# ------
# ^
# [Hello!]
`,
  glsl: `
// @highlight
// coffee
// ------
  // ^
// [Hello!]
`,
  gnuplot: `
# @highlight
# coffee
# ------
 # ^
# [Hello!]
`,
  graphql: `
# @highlight
type Query {
  #  -----
  #    ^
# [Hello world!]
}
`,
  groovy: `
// @highlight
// coffee
// ------
  // ^
// [Hello!]
`,
  hack: `
<?hh
// @highlight
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
-# @highlight
  %body
    %h1 Welcome to My HAML Page
    -#  -------
    -# ^
    -#[Hello World!]
`,
  handlebars: `
{{!-- @highlight --}}
<h1>{{pageTitle}}</h1>
{{!-- --------- --}}
{{!-- ^ --}}
{{!-- [Hello World!] --}}
`,
  haskell: `
-- @highlight
-- This is a single-line
--      ---
--      ^
-- [Hello World!]
`,
  hcl: `
# @highlight
# coffee
# ------
 # ^
# [Hello!]
  `,
  hlsl: `
// @highlight
// coffee
// ------
  // ^
// [Hello!]
  `,
  html: `
<!-- @highlight -->
<p>coffeee</p>   
<!-- ----- -->
<!--  ^ -->
<!-- [Hello ] -->
  `,
  cpp: `
// @highlight
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
// @highlight
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
// @highlight
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
// @highlight
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
  javascript: `// @highlight
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
  imba: `
# @highlight
# coffee
# ------
 # ^
# [Hello!]
`,
  ini: `
; @highlight
[section1]
; coffee
; ------
; ^
; [Hello!]
`,
  properties: `
# @highlight
# coffee
# ------
  # ^
# [Hello!]
`,
  jison: `
// @highlight
// coffee
// ------
  // ^
// [Hello!]
`,
  json: `
{
  "name": "John",
  "age": 30,
  "isStudent": false
}
`,
  json5: `
{
  // This is a JSON5 object with comments
  "name": "John",
// @highlight
  "age": 30,
  "isStudent": false,
// ---------
// ^
//[Hello World!]
}
`,
  jsonc: `
{
  // This is a JSON5 object with comments
  "name": "John",
// @highlight
  "age": 30,
  "isStudent": false,
// ---------
// ^
//[Hello World!]
}
`,
  jsonnet: `
{
  // This is a JSON5 object with comments
  "name": "John",
// @highlight
  "age": 30,
  "isStudent": false,
// ---------
// ^
//[Hello World!]
}
`,
  jssm: `
// @highlight
// coffee
// ------
  // ^
// [Hello!]
`,
  jsx: `
function a() {
  // @highlight
  return <div>
  {/*    ----- */}
  {/*    ^ */}
  {/* [Hello World!] */}
  </div>
}
`,
  kotlin: `
// @highlight
fun main() {
  // This is a single-line comment
  println("Hello, World!")
  //     -----------------
  //      ^
  // [Hello World!]

}
`,
  kusto: `
// This is a single-line comment
// @highlight
let startDate = datetime(2023-01-01);
//  ---------
//    ^
// [Hello world!]
`,
  kql: `
// This is a single-line comment
// @highlight
print "Hello, world!";
//  ---------
//    ^
  // [Hello world!]
`,
  julia: `
# @highlight
variable = 1

variable = 10 
#          --
#          ^
# [Hello World]
`,
  matlab: `
% @highlight
% This is a single-line comment in MATLAB.

variable = 10; 
%          --
  %        ^
  % [Hello World!]
`,
  latex: `
% @highlight
\documentclass{article}
%              -------
%                ^
%  [Hello       World!]
`,
  less: `

#lib() {
  .colors() {
    // @highlights
    @primary: blue;
    @secondary: green;
    /*          ----- */
    /*          ^ */
    /* [Hello World!] */

  }
}
`,
  liquid: `
This is a multi-line comment 
{% comment %}
          ----------
     ^
  [Hello World!]
{% endcomment %}
`,
  php: `
// @highlight
<?php
$variable = 10000;
//          --
//          ^
// [Hello world!]
// @highlight
?>
`,
  lisp: `
; @highlight
(defun calculate-square (x)
  "This function calculates the square of a number."
  ;     --------
  ;        ^
  ; [Hello World!]
  (* x x))
`,
  logo: `
; @highlight
REPEAT 4 [
  FORWARD 100 
; -------
;   ^
;[Hello World!]
  RIGHT 90 
]
`,
  lua: `
-- @highlight
print("Shaku!")
print("Hello, World!") -- This is a comment
--     ------------
--     ^
--    [Hello World!]

`,
  make: `
# Variables
# @highlight
CC = gcc
CFLAGS = -Wall -g
#        -----
#        ^
# [Hello World!]
`,
  makefile: `
# Variables
# @highlight
CC = gcc
CFLAGS = -Wall -g
#        -----
#        ^
# [Hello World!]
`,
  markdown: `
<!-- @highlight -->
# Markdown Comments
<!-- ---- -->
<!-- ^ -->
<!--[Hello]-->
`,
  marko: `
<!-- @highlight  -->
<div>Shaku Snippet!</div>
<!-- -----  -->
<!-- ^  -->
<!-- [Hello Shaku!]  -->

`,
  mdx: `
---
import { Button } from 'Button'
---

{/* @highlight */}
# Markdown Comments
<Alert></Alert>
{/* --- */}
{/* ^ */}
{/* [Hello!] */}

`,
  mermaid: `
graph LR
    A[Start] --> B[Process]
    %% @highlight
    B --> C[Process]
    C --> D[End]
    %%    -----
  %%      ^
  %% [Hello Shaku!]
`,
  nginx: `
# @highlight
server {
  listen 80;
  #      --
  #      ^
  # [Hello Shaku!]
  server_name example.com;
}
`,
  nim: `
# @highlight
proc add(a, b: int): int =
  return a + b
# ------
# ^
# [Hello Shaku!]
`,
  nix: `
{
  # @highlight
  option1 = "value1";
  #         --------
  #          ^
  # [Hello World!]
}
`,
  objc: `
#import <Foundation/Foundation.h>
// @highlight
// This is a single-line comment
// ------
//  ^
// [Hello World!]
`,
  ocaml: `
(* @highlight *)
let main () =
  print_string "Hello, OCaml!";
            (*  ----- *)
            (*  ^ *)
       (*  [Hello World!] *)

`,
  pascal: `
{ @highlight }
uses
  crt;
{ --- }
{ ^ }
{[This is a single-line comment]}
`,
  perl: `
# This is a single-line comment in Perl
# @highlight
print "Hello, World!";
#      -----
#       ^
# [Hello Shaku!]
`,
  powerquery: `
// @highlight
// This is a single-line comment
//           -----------
//              ^
//      [Hello World!]
`,
  powershell: `
# Variables
# @highlight
$age = 25
$name = "John"
#        ----
#         ^
# [Hello World!]
`,
  prisma: `
// @highlight
model User {
  // The user's username
  username  String   @unique
  //        ------
  //         ^
  // [Hello Shaku!]
}
`,
  prolog: `
% Predicates for family relationships
% @highlight
parent(john, sarah).
%     -----
%       ^
%  [Hello World!]

`,
  proto: `
// @highlight
syntax = "proto3";
//       --------
//        ^
// [Hello World!]

`,
  plsql: `
-- @highlight
DECLARE
  v_name VARCHAR2(50);
  --     --------
  --      ^
  --  [Hello Shaku!]
`,
  purescript: `
  -- You can also use comments to explain code
  -- @highlight
add :: Int -> Int -> Int
--     ---
--      ^
-- [Hello World!]
`,
  raku: `
# @highlight
my $variable = 42;  
#  ---------
#    ^
# [Hello World!]
`,
  perl6: `
# This is a single-line comment in Perl
# @highlight
print "Hello, World!";
#      -----
#       ^
# [Hello Shaku!]
`,
  razor: `
<h1>Welcome to our website!</h1>
  @{
    // ----
    // ^
    //[Hello World!]
  }
`,
  reg: `
; @highlight
"CompletionChar"=dword:00000040 
  ;    --------
  ;    ^
  ;[Hello World!]
`,
  rel: `
// @highlight
name: "John"; 
//    -----
//    ^
// [Hello Shaku!]
`,
  riscv: `
# @highlight
.data
  # Data section where
  value1: .word 10
# -----
# ^
#[Hello World!]
`,
  sas: `
/* This is a single-line comment */
/* @highlight */
data mydata;
  set inputdata;
/*    ---------- */
/*    ^ */
/* [Hello World] */
  `,
  sass: `
// Example Sass code with comments
// @highlight
$primary-color: #3498db;
//              -------
//              ^
//        [Hello Shaku!]
`,
  scala: `
// @highlight
object CommentsExample {
  def main(args: Array[String]): Unit = {
    //           -----
    //           ^
    // [Hello Shaku!]
  }
}
`,
  scheme: `
; This is a single-line comment in Scheme

(define (factorial n)
  ; Base case: factorial of 0 is 1
  ; @highlight
  (if (= n 0)
      1
      ; Recursive case: n * factorial of (n - 1)
      (* n (factorial (- n 1)))))
    ; ---------------------------
    ; ^
  ;[Hello Shaku!]
; @highlight start
(display "Factorial of 5 is: ")
(display (factorial 5)) ; Calculate and display factorial
(newline)
; @highlight end

`,
  shaderlab: `
Shader "Custom/ExampleShader" {
  Properties {
      _MainTex ("Texture", 2D) = "white" {}
      _Color ("Tint Color", Color) = (1, 1, 1, 1)
  }

  SubShader {
    // @highlight
      Tags { "RenderType"="Opaque" }
      // @highlight
      LOD 100

      Pass {
          CGPROGRAM
        //----------
        // ^
      //[Hello Shaku!]
          #pragma vertex vert
          // This is a single-line comment
      }
    }
  }
}
`,
  scss: `
/*    @highlight */
.button {
  background-color: $primary-color;
  color: white; 
  /*    ------ */
  /*    ^ */
  /* [Hello World!] */

}
`,
  shader: `
// @highlight start
// Input vertex position
attribute vec3 inPosition;
// @highlight end

// Output vertex position
varying vec4 outPosition;
//           ------------
//           ^
// [Hello World!]

`,
  shellscript: `
# Variable assignment
# @highlight
name="John"
#     ----
#      ^
# [Hello Shaku!]
`,
  bash: `
# Variable assignment
# @highlight
name="Alice"
#     ----
#      ^
# [Hello Shaku!]
`,
  shell: `
# Variable assignment
# @highlight
name="John"
#     ----
#      ^
# [Hello Shaku!]
`,
  zsh: `
# Variable assignment
# @highlight
name="John"
#     ----
#      ^
# [Hello Shaku!]
`,
  smalltalk: `
Object subclass: MyClass [
  "This is a simple class named MyClass."
  
  | instanceVariable |
  
  "@highlight"
  MyClass class >> classMethod [
      "This is a class method of MyClass."
      
      ^ 'Hello from class method!'
      "  -----"
      "  ^ "
  " [Hello Shaku!]"
  ]
  
  MyClass >> instanceMethod [
      "This is an instance method of MyClass."
      
      ^ 'Hello from instance method!'
  ]
]
`,
  solidity: `
// Function to add two numbers
// @highlight
function add(uint256 a, uint256 b) public pure returns (uint256) {
    // Adding the two numbers
    uint256 result = a + b;
  //--------------
  //      ^
  //[Hello World!]
}
`,
  r: `
# @highlight
# Variables
variable <- 123
#        --
#        ^
# [Hello World!]
`,
  sparql: `
# This is a SPARQL query that retrieves the names of all cities and their populations.

# @highlight
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbp: <http://dbpedia.org/property/>
#           ---------
#           ^
# [Hello World!]
`,
  "ssh-config": `
# This is a comment 
Host myserver
    HostName 192.168.1.100
  # @highlight
    Port 22
    User myusername
    #    -----------
    #    ^
# [Hello Shaku!]
`,
  stata: `
* @highlight
use "mydata.dta"
*    ------
*     ^
* [Hello Shaku!]
`,
  stylus: `
body
  background-color: #f0f0f0
  // @highlight
  color: #333 
  //     ----
  //     ^
  // [Hello Shaku!]
`,
  svelte: `
 <script>
 // @highlight
  let count = 0;
//    ---------
//     ^
// [Hello Shaku!]
  // This is a single-line comment
</script>

<main>
  <!-- @highlight -->
  <h1>Hello Svelte!</h1>
<!--  ------------ -->
<!--  ^ -->
<!-- [Hello Shaku!] -->


  <p>The current count is {count}</p>
</main>

<style>
  /* This is a CSS comment */
  /* @highlight */
  main {
    text-align: center;
  /*            ------ */
  /*            ^ */
  /*     [Hello Shaku!] */

    padding: 2rem;
  }
</style>
 `,
  python: `
# @highlight
def greet(name):
    print(f"Hello, {name}!")
  # -----
  #   ^
  # [Hello world!]
`,
  ruby: `
# @highlight
square = variable * variable 
#        --------
#        ^
#   [Hello World!]
`,
  rust: `
// @highlight
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
  -- @highlight
    CustomerID INT PRIMARY KEY,
    FirstName VARCHAR(50),
  --          -------
  --             ^
  --     [Hello World!]
    LastName VARCHAR(50)
);
`,
  "system-verilog": `
// @highlight start
module ExampleModule (
  input logic clk,
  //    -----
  input logic reset,
  output logic [7:0] data
);
// @highlight end
//  ^
//[Hello World!]
endmodule
`,
  tcl: `
# @highlight
set variable_name 42;
# Another comment explaining the above line
#         -------
#          ^
#   [Hello World!]
`,
  tex: `
documentclass{article}

% @highlight
begin{document}

This is some text in the document.
%       ---------
%       ^
% [Hello World!]
`,
  toml: `
# This is a TOML configuration file
# @highlight
title = "Example Config"
description = "An example of using comments in TOML"
#                 -------
#                 ^
#     [Hello Shaku!]

`,
  tsx: `
const MyComponent: React.FC = () => {
  return (
    {/* @highlight */}

    <div>
      {/* This is a comment inside JSX */}
      <h1>Hello, World!</h1>
      {/*        -----  */}
      {/*        ^  */}
      {/*   [Hello World!]  */}
    </div>
  );
};
`,
  turtle: `
import turtle

# @highlight start
# Create a Turtle screen
screen = turtle.Screen()
# @highlight end

# Set the background color of the screen
screen.bgcolor("white")
#      -------
#       ^
# [Hello World!]
`,
  swift: `
// @highlight
import Foundation

var variable = 10 
//           ----
//            ^
// [Hello world!]
`,
  twig: `
{# @highlight #}
{% if condition %}
  <p>The condition is true.</p>
  {# ------------- #}
  {#  ^ #}
  {# [Hello Shaku!] #}
{% else %}
`,
  typescript: `
// @highlight start
function add(a: number, b: number): number {
  return a + b;
}
// @highlight end


// Usage of the function
const result = add(5, 3); // result will be 8
//    ------
//      ^
// [Hello World!]
`,
  vb: `
Imports System
' @highlight
Namespace CommentExample
    Class Program
        ' @highlight
        Sub Main()
            highlight x As Integer = 10
        '   -----
        '    ^
        ' [Hello world!]
        End Sub
    End Class
End Namespace
`,
  verilog: `
// @highlight
module ExampleModule (
  input wire clk,       // Clock input
  input wire reset,     // Reset input
  output reg [7:0] data // Data output
//-----
  // ^
  //[Hello World!]
);

`,
  vhdl: `
-- This is a single-line comment in VHDL

-- @highlight
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
--  --------------
--   ^
-- [Hello Shaku!]

`,
  viml: `
" This is a single-line comment in VimL

" @highlight
let g:my_variable = 42 
"     -----------
"     ^
" [Hello World!]
`,
  vimscript: `
" This is a single-line comment in VimL

" @highlight
let g:my_variable = 42 
"     -----------
"     ^
" [Hello World!]
`,
  vue: `
<template>
  <div>
    <!-- @highlight -->
    <p>{{ message }}</p>
    <!--  ------- -->
    <!--  ^ -->
    <!-- [Hello Shaku!] -->
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "Hello, Vue!",
    // ------
    // ^
    // [Hello Shaku!]
      count: 0
    };
  },
  // @highlight start
  methods: {
    increment() {
      this.count++;
    
    }
  }
  // @highlight end

};
</script>
`,
  wasm: `
;; This is a single-line comment in WebAssembly
(module
  ;; @highlight start
  ;; This is a multi-line comment
  ;; that spans multiple lines
  ;; @highlight end

  (func $add (param $a i32) (param $b i32) (result i32)
    ;; This function adds two integers
    get_local $a
  ;;---------
  ;; ^
;;[Hello Shaku!]
    get_local $b
    i32.add
  )
)
`,
  wenyan: `
注曰。@highlight start
吾有一數。曰五。名之曰「長」。注曰。「「節點的數量」」。
吾有一列。名之曰「橋」。 注曰。「「鄰接數組」」。
注曰。@highlight end

吾有二數。曰一。曰五。名之曰「開始」曰「終點」。
注曰。    --------
注曰。    ^
注曰。 [Hello Shaku!]

注曰。相鄰節點。
`,
  wgsl: `
fn main() -> void {
  // Initialize variables
  var x: f32 = 5.0; // This is the value of x
  // @highlight start
  // Perform some calculations
  x = x * 2.0; // Double the value of x
  // @highlight end

  // Output the result
  log(x); // Log the value of x
  //      ------
  //      ^
  // [Hello Shaku!]
}
`,
  wolfram: `
(* Define a function that calculates the square of a number *)
square[x_] := x^2

(* @highlight start *)
(* Print a message *)
Print["This program calculates the square of a number."]
(*     ---- *)
(*     ^ *)
(*  [Hello Shaku!] *)


(* @highlight end *)

`,
  xml: `
<!-- @highlight -->
<!-- This is a comment inside the root element -->
<element1>
    <!-- Comment for element1 -->
    <subelement>Content</subelement>
    <!--        _______ -->
    <!--        ^ -->
    <!--     [Hello Shaku!] -->

</element1>
`,
  xsl: `
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <!-- This is a comment explaining the purpose of the XSLT stylesheet -->
  
  <!-- @highlight start -->
  <!-- Match any element and copy it to the output unchanged -->
  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    <!--   _______________ -->
    <!--        ^ -->
    <!--     [Hello Shaku!] -->
    </xsl:copy>
  </xsl:template>
  <!-- @highlight end -->


</xsl:stylesheet>
`,
  yaml: `
# Configuration settings for an application
# @highlight start
app_settings:
  name: MyApp
  version: 1.0
  # @highlight end

  # The following line is a comment about the description
  description: This is a sample application
  #            ----------------
  #            ^
  #    [Hello World!]

`,
  zenscript: `
// @highlight start
// Hello
// @highlight end

print("This line is commented out")
//     ----
//     ^
// [Hello Shaku!]
`,
};

export const supportedLangs = [
  "abap",
  "actionscript-3",
  "ada",
  "apache",
  "apex",
  "apl",
  "applescript",
  "ara",
  "asm",
  "astro",
  "awk",
  "ballerina",
  "bat",
  "batch",
  "berry",
  "be",
  // "bibtex",
  "bicep",
  "blade",
  "c",
  "cadence",
  // "cdc",
  "clarity",
  "clojure",
  // "clj",
  "cmake",
  "cobol",
  "codeql", // nothing to test
  // "ql",
  "coffee",
  "cpp",
  "crystal",
  "c#",
  "cs",
  "css",
  "cue",
  "d",
  "dart",
  "dax",
  "diff", // nothing to test
  "docker",
  "dockerfile",
  "dream-maker",
  "elixir",
  "elm",
  "erb",
  "erlang",
  "erl",
  "fish",
  "fsharp",
  "f#",
  "fs",
  // "gdresource",
  // "gdscript",
  // "gdshader",
  // "gherkin",
  "git-commit",
  // "git-rebase",
  "glsl",
  "gnuplot",
  "go",
  "graphql",
  "groovy",
  "hack",
  "haml",
  "handlebars",
  "hbs",
  "haskell",
  "hs",
  "hcl",
  "hlsl",
  "html",
  // "http",
  "imba",
  "ini",
  "properties",
  "java",
  "javascript",
  "js",
  // "jinja-html",
  "jison",
  "json",
  "json5",
  "jsonc",
  "jsonnet",
  "jssm",
  "fsl",
  "jsx",
  "julia",
  "kotlin",
  "kusto",
  "kql",
  "latex",
  "less",
  "liquid",
  "lisp",
  "logo",
  "lua",
  "make",
  "makefile",
  "markdown",
  "md",
  "marko",
  "matlab",
  "mdx",
  "mermaid",
  "nginx",
  "nim",
  "nix",
  "objective-c",
  "objc",
  "objective-cpp",
  "ocaml",
  "pascal",
  "perl",
  "php",
  "plsql",
  // "postcss",
  "powerquery",
  "powershell",
  "ps",
  // "ps1",
  "prisma",
  "prolog",
  "proto",
  // "pug",
  // "jade",
  // "puppet",
  "purescript",
  "python",
  "r",
  "raku",
  "perl6",
  "razor",
  "reg",
  "rel",
  "riscv",
  "rst",
  "ruby",
  "rb",
  "rust",
  "rs",
  "sas",
  "sass",
  "scala",
  "scheme",
  "scss",
  "shaderlab",
  "shader",
  "shellscript",
  "bash",
  // "console",
  "sh",
  "shell",
  "zsh",
  "smalltalk",
  "solidity",
  "sparql",
  "sql",
  "ssh-config",
  "stata",
  "stylus",
  "styl",
  "svelte",
  "swift",
  "system-verilog",
  // "tasl",
  "tcl",
  "tex",
  "toml",
  "tsx",
  "turtle",
  "twig",
  "typescript",
  "ts",
  // "v",
  "vb",
  // "cmd",
  "verilog",
  "vhdl",
  "viml",
  // "vim",
  "vimscript",
  // "vue-html",
  "vue",
  "wasm",
  "wenyan",
  // "文言",
  "wgsl",
  "wolfram",
  "xml",
  "xsl",
  "yaml",
  "yml",
  "zenscript",
];
