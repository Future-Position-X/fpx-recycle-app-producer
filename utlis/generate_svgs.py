unselected = "#a9c2d9" #light blue
selected = "#0aa67a" #green

for i in range(0, 100):
    unselected_svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="{unselected}"/><text text-anchor="middle" x="10" y="14.5" style="fill: white; font: bold 13px sans-serif;">{i}</text></svg>'
    selected_svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="{selected}"/><text text-anchor="middle" x="10" y="14.5" style="fill: white; font: bold 13px sans-serif;">{i}</text></svg>'
    with open(f'unselected_{i}.svg', 'w') as the_file:
        the_file.write(unselected_svg)
    with open(f'selected_{i}.svg', 'w') as the_file:
        the_file.write(selected_svg)
