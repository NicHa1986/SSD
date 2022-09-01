import re

list1 = ['1WST258','M60 1NW','CR2 6XH','1sdt258','2WST258','3WST258','1WST25E','1HJL333']

# The belgian postcode always starts with a "1" or '2' ad then three letters followed by 3 numbers
postcode = r"^[1|2][A-Z]{3}[\d]{3}$"

for i in list1:
  if re.match(postcode,i):
    print("OK")
  else:
    print("Your code is not a valid code")