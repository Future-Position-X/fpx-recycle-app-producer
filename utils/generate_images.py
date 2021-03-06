import os

unselected = "#a9c2d9" #light blue
selected = "#0aa67a" #green

for i in range(0, 100):
    unselected_svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="{unselected}"/><text text-anchor="middle" x="10" y="14.5" style="fill: white; font: bold 13px sans-serif;">{i}</text></svg>'
    selected_svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="{selected}"/><text text-anchor="middle" x="10" y="14.5" style="fill: white; font: bold 13px sans-serif;">{i}</text></svg>'
    selected_big_svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="13" fill="{selected}"/><text text-anchor="middle" x="13" y="17.5" style="fill: white; font: bold 13px sans-serif;">{i}</text></svg>'
    with open(f'unselected_{i}.svg', 'w') as the_file:
        the_file.write(unselected_svg)
    with open(f'selected_{i}.svg', 'w') as the_file:
        the_file.write(selected_svg)
    with open(f'selected_big_{i}.svg', 'w') as the_file:
        the_file.write(selected_big_svg)

os.system('mogrify -format png -background "rgba(0,0,0,0.0)" *.svg')
os.system('rm -f *.svg')