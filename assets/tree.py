#!/usr/bin/env python3
"""Generateur d'arbre SVG, trait crayon fin, noir et blanc."""
import math, random, sys

SEED = int(sys.argv[1]) if len(sys.argv) > 1 else 12
OUT = sys.argv[2] if len(sys.argv) > 2 else 'tree.svg'
rnd = random.Random(SEED)

VW, VH = 1000, 1560
BASE_X, BASE_Y = 500, 1452
CX, CY, RX, RY = 500, 545, 410, 455        # enveloppe de la couronne
MAXD = 10                                  # profondeur maximale
LEADER = 4                                 # niveaux ou le tronc reste dominant

segments = []   # dict(pts, w0, w1, depth)
tips = []       # (x, y, depth)

# lobes : evite une couronne trop parfaitement elliptique
LOBES = [(rnd.uniform(0, 6.28), rnd.uniform(.04, .11)) for _ in range(3)]


def crown_d(x, y):
    a = math.atan2(y - CY, x - CX)
    k = 1.0
    for i, (ph, amp) in enumerate(LOBES):
        k += amp * math.sin((i + 2) * a + ph)
    return math.hypot((x - CX) / (RX * k), (y - CY) / (RY * k))


def grow(x, y, ang, length, bend, coarse=False):
    steps = max(2, int(length / 42)) if coarse else max(3, int(length / 20))
    pts = [(x, y)]
    a, px, py = ang, x, y
    for _ in range(steps):
        a += bend / steps
        s = length / steps
        px += math.sin(a) * s
        py -= math.cos(a) * s
        pts.append((px, py))
    return pts, a


def branch(x, y, ang, length, width, depth):
    if depth == 0:
        bend = rnd.uniform(-.08, .08)
    elif depth <= LEADER:
        bend = rnd.uniform(-.22, .22)
    else:
        bend = rnd.uniform(-.32, .32)

    d = crown_d(x, y)
    if d > .72:                                  # rappel vers l'interieur
        toward = math.atan2(CX - x, y - CY)
        diff = (toward - ang + math.pi) % (2 * math.pi) - math.pi
        pull = diff * min(.55, (d - .72) * 1.5)
        bend += max(-.5, min(.5, pull))          # borne : pas d'enroulement

    pts, end_ang = grow(x, y, ang, length, bend, coarse=depth > LEADER + 1)
    ex, ey = pts[-1]

    if depth >= MAXD or width < .44:
        segments.append(dict(pts=pts, w0=width, w1=max(width * .8, .3), depth=depth))
        tips.append((ex, ey))
        return

    kids = []                                    # (angle, largeur, facteur longueur)

    if depth < LEADER:
        # fleche dominante : le tronc se poursuit, les charpentieres partent sur le cote
        kids.append((rnd.uniform(-.13, .13), width * .82,
                     .58 if depth == 0 else .82))
        nlat = 1 if depth == 0 else rnd.choice([1, 1, 2])
        for i in range(nlat):
            side = rnd.choice([-1, 1])
            kids.append((side * math.radians(rnd.uniform(28, 46)),
                         width * .6 * rnd.uniform(.9, 1.06), .7))
    else:
        # ramification en eventail
        n = 3 if rnd.random() < .18 else 2
        spread = math.radians(rnd.uniform(22, 44))
        offs = ([-spread * rnd.uniform(.5, 1.), spread * rnd.uniform(.5, 1.)] if n == 2
                else [-spread * rnd.uniform(.7, 1.05), spread * rnd.uniform(-.25, .25),
                      spread * rnd.uniform(.7, 1.05)])
        rnd.shuffle(offs)
        for off in offs:
            kids.append((off, width * (.63 if n == 2 else .56) * rnd.uniform(.9, 1.06),
                         rnd.uniform(.68, .84)))

    # la section se ferme sur la plus grosse fille : pas de marche d'escalier
    w1 = max(max(k[1] for k in kids), width * .55)
    segments.append(dict(pts=pts, w0=width, w1=max(w1, .3), depth=depth))

    for off, kw, kl in kids:
        na = end_ang + off
        na += math.sin(na) * .07                 # legere gravite
        if abs(na) > 1.15:                       # pas de branche qui pendouille
            na *= .9
        branch(ex, ey, na, length * kl, kw, depth + 1)

    if LEADER <= depth <= MAXD - 3 and rnd.random() < .4:   # brindille laterale
        k = rnd.uniform(.4, .8)
        mx, my = pts[int(len(pts) * k)]
        na = end_ang + rnd.choice([-1, 1]) * math.radians(rnd.uniform(50, 82))
        branch(mx, my, na, length * rnd.uniform(.32, .48), width * .42, depth + 2)


# ------------------------------------------------------------------ rendu

def f(v):
    return ('%.1f' % v).rstrip('0').rstrip('.')


def polyline(pts):
    """trait simple, coordonnees entieres : suffisant pour les rameaux fins"""
    out, last = [], None
    for (x, y) in pts:
        xy = (round(x), round(y))
        if xy != last:
            out.append('%s%d %d' % ('M' if last is None else 'L', xy[0], xy[1]))
            last = xy
    return ''.join(out) if len(out) > 1 else ''


def path_from(pts, move=True):
    d = '%s%s %s' % ('M' if move else 'L', f(pts[0][0]), f(pts[0][1]))
    for i in range(1, len(pts) - 1):
        mx = (pts[i][0] + pts[i + 1][0]) / 2
        my = (pts[i][1] + pts[i + 1][1]) / 2
        d += 'Q%s %s %s %s' % (f(pts[i][0]), f(pts[i][1]), f(mx), f(my))
    d += 'L%s %s' % (f(pts[-1][0]), f(pts[-1][1]))
    return d


def tapered(pts, w0, w1, flare=0):
    """un seul contour ferme : aller par la gauche, retour par la droite"""

    def ext(a, b, d):                            # prolonge a, en s'eloignant de b
        dx, dy = a[0] - b[0], a[1] - b[1]
        L = math.hypot(dx, dy) or 1
        return (a[0] + dx / L * d, a[1] + dy / L * d)

    # bouts prolonges : sinon une fente blanche s'ouvre a chaque jonction,
    # les deux troncons n'ayant pas la meme orientation
    pts = [ext(pts[0], pts[1], w0 * .35)] + list(pts) + [ext(pts[-1], pts[-2], w1 * .35)]

    left, right, n = [], [], len(pts)
    for i, (x, y) in enumerate(pts):
        t = i / (n - 1)
        w = (w0 + (w1 - w0) * t) / 2
        if flare and t < .2:
            w *= 1 + flare * ((.2 - t) / .2) ** 2
        if i == 0:
            dx, dy = pts[1][0] - x, pts[1][1] - y
        elif i == n - 1:
            dx, dy = x - pts[-2][0], y - pts[-2][1]
        else:
            dx, dy = pts[i + 1][0] - pts[i - 1][0], pts[i + 1][1] - pts[i - 1][1]
        L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L, dx / L
        left.append((x + nx * w, y + ny * w))
        right.append((x - nx * w, y - ny * w))
    return path_from(left) + path_from(list(reversed(right)), move=False) + 'Z'


def leaf(x, y):
    """coup de crayon court : depart entier + vecteur"""
    a = rnd.uniform(0, 6.283)
    L = rnd.uniform(2.5, 6.5)
    dx, dy = round(math.cos(a) * L), round(math.sin(a) * L)
    if dx == 0 and dy == 0:
        dx = 1
    return (round(x), round(y), dx, dy)


def leaf_path(group):
    """chaine les marques en coordonnees relatives, pour un fichier compact"""
    d, cx, cy = ['M0 0'], 0, 0
    for (x, y, dx, dy) in group:
        d.append('m%d %dl%d %d' % (x - cx, y - cy, dx, dy))
        cx, cy = x + dx, y + dy
    return ''.join(d)


def build():
    branch(BASE_X, BASE_Y, rnd.uniform(-.04, .04), 340, 48, 0)

    roots = []
    for k in range(8):
        a = math.radians(rnd.uniform(60, 94)) * (1 if k % 2 else -1)
        pts, _ = grow(BASE_X + rnd.uniform(-15, 15), BASE_Y - rnd.uniform(0, 20),
                      a, rnd.uniform(28, 68), rnd.uniform(.35, .95) * (1 if a > 0 else -1))
        roots.append(tapered(pts, rnd.uniform(5, 10), .5))

    fills, strokes = [], []
    for s in segments:
        if s['w0'] > 2.4:
            fills.append(tapered(s['pts'], s['w0'], s['w1'],
                                 flare=.85 if s['depth'] == 0 else 0))
        else:
            w = (s['w0'] + s['w1']) / 2
            if w >= .5:
                strokes.append((polyline(s['pts']), w))

    # ecorce : hachures claires dans le tronc et les grosses branches
    bark = []
    for s in segments:
        if s['w0'] < 6:
            continue
        pts = s['pts']
        for _ in range(int(s['w0'] * 1.3)):
            t0 = rnd.uniform(0, .8)
            i0 = int(t0 * (len(pts) - 1))
            i1 = min(len(pts) - 1, i0 + rnd.randint(1, 4))
            if i1 <= i0:
                continue
            off = rnd.uniform(-.34, .34)
            sub = []
            for i in range(i0, i1 + 1):
                t = i / (len(pts) - 1)
                w = s['w0'] + (s['w1'] - s['w0']) * t
                x, y = pts[i]
                px, py = pts[max(i - 1, 0)]
                dx, dy = (x - px, y - py) if i else (pts[1][0] - x, pts[1][1] - y)
                L = math.hypot(dx, dy) or 1
                sub.append((x - dy / L * w * off, y + dx / L * w * off))
            if len(sub) > 2:
                bark.append(polyline(sub))

    # feuillage : marques semees le long des rameaux fins, densite reguliere
    leaves = []

    def sow(x, y, spread):
        a, r = rnd.uniform(0, 6.283), spread * math.sqrt(rnd.random())
        lx, ly = x + math.cos(a) * r, y + math.sin(a) * r
        if crown_d(lx, ly) < 1.16:
            leaves.append(leaf(lx, ly))

    for s2 in segments:
        if s2['depth'] < MAXD - 3 or s2['w0'] > 1.2:
            continue
        pts = s2['pts']
        for i in range(len(pts) - 1):
            (x0, y0), (x1, y1) = pts[i], pts[i + 1]
            seg = math.hypot(x1 - x0, y1 - y0)
            n = seg / 7.2
            n = int(n) + (1 if rnd.random() < n - int(n) else 0)
            for k in range(n):
                t = (k + rnd.random()) / max(n, 1)
                sow(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, rnd.uniform(3, 9))

    for (x, y) in tips:                          # bouquet en bout de rameau
        if crown_d(x, y) < 1.2:
            for _ in range(rnd.randint(1, 4)):
                sow(x, y, rnd.uniform(4, 10))


    ground = []
    for _ in range(30):
        x = BASE_X + rnd.gauss(0, 160)
        y = BASE_Y + rnd.uniform(2, 24)
        L = rnd.uniform(16, 100) * max(0, 1 - abs(x - BASE_X) / 430)
        if L < 6:
            continue
        ground.append('M%s %sq%s %s %s 0' % (f(x), f(y), f(L / 2),
                                             f(rnd.uniform(-3, 3)), f(L)))

    o = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" '
         'height="%d">' % (VW, VH, VW, VH)]
    o.append('<g fill="#111" opacity=".82"><path d="%s"/><path d="%s"/></g>'
             % (''.join(roots), ''.join(fills)))

    by_w = {}
    for d, w in strokes:
        if d:
            by_w.setdefault(round(w, 1), []).append(d)
    o.append('<g stroke="#111" stroke-linecap="round" fill="none">')
    for k in sorted(by_w):
        o.append('<path stroke-width="%s" d="%s"/>' % (f(k), ''.join(by_w[k])))
    o.append('</g>')

    o.append('<path stroke="#fff" stroke-width=".65" opacity=".45" fill="none" d="%s"/>'
             % ''.join(bark))

    for i, op in enumerate(('.92', '.62', '.38')):
        chunk = leaves[i::3]
        if chunk:
            o.append('<path stroke="#111" stroke-width=".85" stroke-linecap="round" '
                     'opacity="%s" fill="none" d="%s"/>' % (op, leaf_path(chunk)))

    o.append('<path stroke="#111" stroke-width=".9" opacity=".45" stroke-linecap="round" '
             'fill="none" d="%s"/>' % ''.join(ground))
    o.append('</svg>')
    return '\n'.join(o), len(leaves)


svg, nleaves = build()
open(OUT, 'w').write(svg)
print('seed=%s segments=%d tips=%d feuilles=%d taille=%.0f Ko'
      % (SEED, len(segments), len(tips), nleaves, len(svg) / 1024))
