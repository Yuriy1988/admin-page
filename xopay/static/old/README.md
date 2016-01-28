XOtel
=====

Install soft
------------
https://httpd.apache.org/docs/2.4/platform/windows.html
http://www.telerik.com/download/fiddler


Config
--------
Clone git repository to **www** dir in Apache directory.

In fiddler go to **AutoResponder** tab and enable checkboxes **Enable rules** and **Unmatched requests passthrough**.
Press **Add rule** button and fill inputs:

- Up input: **regex:http://localhost([:0-9]+)/remote(.+)**
- Down input: **http://taxi.digitaloutlooks.com:8090$2**

and the next press save.

Open in your browser page **http://localhost/**.