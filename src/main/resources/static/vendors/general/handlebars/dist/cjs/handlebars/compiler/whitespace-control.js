'use strict';

exports.__esModule = true;

// istanbul ignore next

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {'default': obj};
}

var _visitor = require('./visitor');

var _visitor2 = _interopRequireDefault(_visitor);

function WhitespaceControl() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    this.options = options;
}

WhitespaceControl.prototype = new _visitor2['default']();

WhitespaceControl.prototype.Program = function (program) {
    var doStandalone = !this.options.ignoreStandalone;

    var isRoot = !this.isRootSeen;
    this.isRootSeen = true;

    var body = program.body;
    for (var i = 0, l = body.length; i < l; i++) {
        var current = body[i],
            strip = this.accept(current);

        if (!strip) {
            continue;
        }

        var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot),
            _isNextWhitespace = isNextWhitespace(body, i, isRoot),
            openStandalone = strip.openStandalone && _isPrevWhitespace,
            closeStandalone = strip.closeStandalone && _isNextWhitespace,
            inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;

        if (strip.close) {
            omitRight(body, i, true);
        }
        if (strip.open) {
            omitLeft(body, i, true);
        }

        if (doStandalone && inlineStandalone) {
            omitRight(body, i);

            if (omitLeft(body, i)) {
                // If we are on a standalone node, save the indent info for partials
                if (current.type === 'PartialStatement') {
                    // Pull out the whitespace from the final line
                    current.indent = /([ \t]+$)/.exec(body[i - 1].original)[1];
                }
            }
        }
        if (doStandalone && openStandalone) {
            omitRight((current.program || current.inverse).body);

            // Strip out the previous content node if it's whitespace only
            omitLeft(body, i);
        }
        if (doStandalone && closeStandalone) {
            // Always strip the next node
            omitRight(body, i);

            omitLeft((current.inverse || current.program).body);
        }
    }

    return program;
};

WhitespaceControl.prototype.BlockStatement = WhitespaceControl.prototype.DecoratorBlock = WhitespaceControl.prototype.PartialBlockStatement = function (block) {
    this.accept(block.program);
    this.accept(block.inverse);

    // Find the inverse program that is involed with whitespace stripping.
    var program = block.program || block.inverse,
        inverse = block.program && block.inverse,
        firstInverse = inverse,
        lastInverse = inverse;

    if (inverse && inverse.chained) {
        firstInverse = inverse.body[0].program;

        // Walk the inverse chain to find the last inverse that is actually in the chain.
        while (lastInverse.chained) {
            lastInverse = lastInverse.body[lastInverse.body.length - 1].program;
        }
    }

    var strip = {
        open: block.openStrip.open,
        close: block.closeStrip.close,

        // Determine the standalone candiacy. Basically flag our content as being possibly standalone
        // so our parent can determine if we actually are standalone
        openStandalone: isNextWhitespace(program.body),
        closeStandalone: isPrevWhitespace((firstInverse || program).body)
    };

    if (block.openStrip.close) {
        omitRight(program.body, null, true);
    }

    if (inverse) {
        var inverseStrip = block.inverseStrip;

        if (inverseStrip.open) {
            omitLeft(program.body, null, true);
        }

        if (inverseStrip.close) {
            omitRight(firstInverse.body, null, true);
        }
        if (block.closeStrip.open) {
            omitLeft(lastInverse.body, null, true);
        }

        // Find standalone else statments
        if (!this.options.ignoreStandalone && isPrevWhitespace(program.body) && isNextWhitespace(firstInverse.body)) {
            omitLeft(program.body);
            omitRight(firstInverse.body);
        }
    } else if (block.closeStrip.open) {
        omitLeft(program.body, null, true);
    }

    return strip;
};

WhitespaceControl.prototype.Decorator = WhitespaceControl.prototype.MustacheStatement = function (mustache) {
    return mustache.strip;
};

WhitespaceControl.prototype.PartialStatement = WhitespaceControl.prototype.CommentStatement = function (node) {
    /* istanbul ignore next */
    var strip = node.strip || {};
    return {
        inlineStandalone: true,
        open: strip.open,
        close: strip.close
    };
};

function isPrevWhitespace(body, i, isRoot) {
    if (i === undefined) {
        i = body.length;
    }

    // Nodes that end with newlines are considered whitespace (but are special
    // cased for strip operations)
    var prev = body[i - 1],
        sibling = body[i - 2];
    if (!prev) {
        return isRoot;
    }

    if (prev.type === 'ContentStatement') {
        return (sibling || !isRoot ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(prev.original);
    }
}

function isNextWhitespace(body, i, isRoot) {
    if (i === undefined) {
        i = -1;
    }

    var next = body[i + 1],
        sibling = body[i + 2];
    if (!next) {
        return isRoot;
    }

    if (next.type === 'ContentStatement') {
        return (sibling || !isRoot ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(next.original);
    }
}

// Marks the node to the right of the position as omitted.
// I.e. {{foo}}' ' will mark the ' ' node as omitted.
//
// If i is undefined, then the first child will be marked as such.
//
// If mulitple is truthy then all whitespace will be stripped out until non-whitespace
// content is met.
function omitRight(body, i, multiple) {
    var current = body[i == null ? 0 : i + 1];
    if (!current || current.type !== 'ContentStatement' || !multiple && current.rightStripped) {
        return;
    }

    var original = current.value;
    current.value = current.value.replace(multiple ? /^\s+/ : /^[ \t]*\r?\n?/, '');
    current.rightStripped = current.value !== original;
}

// Marks the node to the left of the position as omitted.
// I.e. ' '{{foo}} will mark the ' ' node as omitted.
//
// If i is undefined then the last child will be marked as such.
//
// If mulitple is truthy then all whitespace will be stripped out until non-whitespace
// content is met.
function omitLeft(body, i, multiple) {
    var current = body[i == null ? body.length - 1 : i - 1];
    if (!current || current.type !== 'ContentStatement' || !multiple && current.leftStripped) {
        return;
    }

    // We omit the last node if it's whitespace only and not preceeded by a non-content node.
    var original = current.value;
    current.value = current.value.replace(multiple ? /\s+$/ : /[ \t]+$/, '');
    current.leftStripped = current.value !== original;
    return current.leftStripped;
}

exports['default'] = WhitespaceControl;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2NvbXBpbGVyL3doaXRlc3BhY2UtY29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O3VCQUFvQixXQUFXOzs7O0FBRS9CLFNBQVMsaUJBQWlCLEdBQWU7TUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQ3JDLE1BQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0NBQ3hCO0FBQ0QsaUJBQWlCLENBQUMsU0FBUyxHQUFHLDBCQUFhLENBQUM7O0FBRTVDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsVUFBUyxPQUFPLEVBQUU7QUFDdEQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDOztBQUVwRCxNQUFJLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDOUIsTUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7O0FBRXZCLE1BQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDeEIsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMzQyxRQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVqQyxRQUFJLENBQUMsS0FBSyxFQUFFO0FBQ1YsZUFBUztLQUNWOztBQUVELFFBQUksaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUM7UUFDckQsaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUM7UUFFckQsY0FBYyxHQUFHLEtBQUssQ0FBQyxjQUFjLElBQUksaUJBQWlCO1FBQzFE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QUFDeEQsTUFBSSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLGtCQUFrQixJQUFLLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxZQUFZLEFBQUMsRUFBRTtBQUMxRixXQUFPO0dBQ1I7OztBQUdELE1BQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7QUFDN0IsU0FBTyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUksTUFBTSxHQUFLLFNBQVMsQUFBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzdFLFNBQU8sQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUM7QUFDbEQsU0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDO0NBQzdCOztxQkFFYyxpQkFBaUIiLCJmaWxlIjoid2hpdGVzcGFjZS1jb250cm9sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpc2l0b3IgZnJvbSAnLi92aXNpdG9yJztcblxuZnVuY3Rpb24gV2hpdGVzcGFjZUNvbnRyb2wob3B0aW9ucyA9IHt9KSB7XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG59XG5XaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUgPSBuZXcgVmlzaXRvcigpO1xuXG5XaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUuUHJvZ3JhbSA9IGZ1bmN0aW9uKHByb2dyYW0pIHtcbiAgY29uc3QgZG9TdGFuZGFsb25lID0gIXRoaXMub3B0aW9ucy5pZ25vcmVTdGFuZGFsb25lO1xuXG4gIGxldCBpc1Jvb3QgPSAhdGhpcy5pc1Jvb3RTZWVuO1xuICB0aGlzLmlzUm9vdFNlZW4gPSB0cnVlO1xuXG4gIGxldCBib2R5ID0gcHJvZ3JhbS5ib2R5O1xuICBmb3IgKGxldCBpID0gMCwgbCA9IGJvZHkubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgbGV0IGN1cnJlbnQgPSBib2R5W2ldLFxuICAgICAgICBzdHJpcCA9IHRoaXMuYWNjZXB0KGN1cnJlbnQpO1xuXG4gICAgaWYgKCFzdHJpcCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgbGV0IF9pc1ByZXZXaGl0ZXNwYWNlID0gaXNQcmV2V2hpdGVzcGFjZShib2R5LCBpLCBpc1Jvb3QpLFxuICAgICAgICBfaXNOZXh0V2hpdGVzcGFjZSA9IGlzTmV4dFdoaXRlc3BhY2UoYm9keSwgaSwgaXNSb290KSxcblxuICAgICAgICBvcGVuU3RhbmRhbG9uZSA9IHN0cmlwLm9wZW5TdGFuZGFsb25lICYmIF9pc1ByZXZXaGl0ZXNwYWNlLFxuICAgICAgICBjbG9zZVN0YW5kYWxvbmUgPSBzdHJpcC5jbG9zZVN0YW5kYWxvbmUgJiYgX2lzTmV4dFdoaXRlc3BhY2UsXG4gICAgICAgIGlubGluZVN0YW5kYWxvbmUgPSBzdHJpcC5pbmxpbmVTdGFuZGFsb25lICYmIF9pc1ByZXZXaGl0ZXNwYWNlICYmIF9pc05leHRXaGl0ZXNwYWNlO1xuXG4gICAgaWYgKHN0cmlwLmNsb3NlKSB7XG4gICAgICBvbWl0UmlnaHQoYm9keSwgaSwgdHJ1ZSk7XG4gICAgfVxuICAgIGlmIChzdHJpcC5vcGVuKSB7XG4gICAgICBvbWl0TGVmdChib2R5LCBpLCB0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAoZG9TdGFuZGFsb25lICYmIGlubGluZVN0YW5kYWxvbmUpIHtcbiAgICAgIG9taXRSaWdodChib2R5LCBpKTtcblxuICAgICAgaWYgKG9taXRMZWZ0KGJvZHksIGkpKSB7XG4gICAgICAgIC8vIElmIHdlIGFyZSBvbiBhIHN0YW5kYWxvbmUgbm9kZSwgc2F2ZSB0aGUgaW5kZW50IGluZm8gZm9yIHBhcnRpYWxzXG4gICAgICAgIGlmIChjdXJyZW50LnR5cGUgPT09ICdQYXJ0aWFsU3RhdGVtZW50Jykge1xuICAgICAgICAgIC8vIFB1bGwgb3V0IHRoZSB3aGl0ZXNwYWNlIGZyb20gdGhlIGZpbmFsIGxpbmVcbiAgICAgICAgICBjdXJyZW50LmluZGVudCA9ICgvKFsgXFx0XSskKS8pLmV4ZWMoYm9keVtpIC0gMV0ub3JpZ2luYWwpWzFdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChkb1N0YW5kYWxvbmUgJiYgb3BlblN0YW5kYWxvbmUpIHtcbiAgICAgIG9taXRSaWdodCgoY3VycmVudC5wcm9ncmFtIHx8IGN1cnJlbnQuaW52ZXJzZSkuYm9keSk7XG5cbiAgICAgIC8vIFN0cmlwIG91dCB0aGUgcHJldmlvdXMgY29udGVudCBub2RlIGlmIGl0J3Mgd2hpdGVzcGFjZSBvbmx5XG4gICAgICBvbWl0TGVmdChib2R5LCBpKTtcbiAgICB9XG4gICAgaWYgKGRvU3RhbmRhbG9uZSAmJiBjbG9zZVN0YW5kYWxvbmUpIHtcbiAgICAgIC8vIEFsd2F5cyBzdHJpcCB0aGUgbmV4dCBub2RlXG4gICAgICBvbWl0UmlnaHQoYm9keSwgaSk7XG5cbiAgICAgIG9taXRMZWZ0KChjdXJyZW50LmludmVyc2UgfHwgY3VycmVudC5wcm9ncmFtKS5ib2R5KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcHJvZ3JhbTtcbn07XG5cbldoaXRlc3BhY2VDb250cm9sLnByb3RvdHlwZS5CbG9ja1N0YXRlbWVudCA9XG5XaGl0ZXNwYWNlQ29udHJvbC5wcm90b3R5cGUuRGVjb3JhdG9yQmxvY2sgPVxuV2hpdGVzcGFjZUNvbnRyb2wucHJvdG90eXBlLlBhcnRpYWxCbG9ja1N0YXRlbWVudCA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gIHRoaXMuYWNjZXB0KGJsb2NrLnByb2dyYW0pO1xuICB0aGlzLmFjY2VwdChibG9jay5pbnZlcnNlKTtcblxuICAvLyBGaW5kIHRoZSBpbnZlcnNlIHByb2dyYW0gdGhhdCBpcyBpbnZvbGVkIHdpdGggd2hpdGVzcGFjZSBzdHJpcHBpbmcuXG4gIGxldCBwcm9ncmFtID0gYmxvY2sucHJvZ3JhbSB8fCBibG9jay5pbnZlcnNlLFxuICAgICAgaW52ZXJzZSA9IGJsb2NrLnByb2dyYW0gJiYgYmxvY2suaW52ZXJzZSxcbiAgICAgIGZpcnN0SW52ZXJzZSA9IGludmVyc2UsXG4gICAgICBsYXN0SW52ZXJzZSA9IGludmVyc2U7XG5cbiAgaWYgKGludmVyc2UgJiYgaW52ZXJzZS5jaGFpbmVkKSB7XG4gICAgZmlyc3RJbnZlcnNlID0gaW52ZXJzZS5ib2R5WzBdLnByb2dyYW07XG5cbiAgICAvLyBXYWxrIHRoZSBpbnZlcnNlIGNoYWluIHRvIGZpbmQgdGhlIGxhc3QgaW52ZXJzZSB0aGF0IGlzIGFjdHVhbGx5IGluIHRoZSBjaGFpbi5cbiAgICB3aGlsZSAobGFzdEludmVyc2UuY2hhaW5lZCkge1xuICAgICAgbGFzdEludmVyc2UgPSBsYXN0SW52ZXJzZS5ib2R5W2xhc3RJbnZlcnNlLmJvZHkubGVuZ3RoIC0gMV0ucHJvZ3JhbTtcbiAgICB9XG4gIH1cblxuICBsZXQgc3RyaXAgPSB7XG4gICAgb3BlbjogYmxvY2sub3BlblN0cmlwLm9wZW4sXG4gICAgY2xvc2U6IGJsb2NrLmNsb3NlU3RyaXAuY2xvc2UsXG5cbiAgICAvLyBEZXRlcm1pbmUgdGhlIHN0YW5kYWxvbmUgY2FuZGlhY3kuIEJhc2ljYWxseSBmbGFnIG91ciBjb250ZW50IGFzIGJlaW5nIHBvc3NpYmx5IHN0YW5kYWxvbmVcbiAgICAvLyBzbyBvdXIgcGFyZW50IGNhbiBkZXRlcm1pbmUgaWYgd2UgYWN0dWFsbHkgYXJlIHN0YW5kYWxvbmVcbiAgICBvcGVuU3RhbmRhbG9uZTogaXNOZXh0V2hpdGVzcGFjZShwcm9ncmFtLmJvZHkpLFxuICAgIGNsb3NlU3RhbmRhbG9uZTogaXNQcmV2V2hpdGVzcGFjZSgoZmlyc3RJbnZlcnNlIHx8IHByb2dyYW0pLmJvZHkpXG4gIH07XG5cbiAgaWYgKGJsb2NrLm9wZW5TdHJpcC5jbG9zZSkge1xuICAgIG9taXRSaWdodChwcm9ncmFtLmJvZHksIG51bGwsIHRydWUpO1xuICB9XG5cbiAgaWYgKGludmVyc2UpIHtcbiAgICBsZXQgaW52ZXJzZVN0cmlwID0gYmxvY2suaW52ZXJzZVN0cmlwO1xuXG4gICAgaWYgKGludmVyc2VTdHJpcC5vcGVuKSB7XG4gICAgICBvbWl0TGVmdChwcm9ncmFtLmJvZHksIG51bGwsIHRydWUpO1xuICAgIH1cblxuICAgIGlmIChpbnZlcnNlU3RyaXAuY2xvc2UpIHtcbiAgICAgIG9taXRSaWdodChmaXJzdEludmVyc2UuYm9keSwgbnVsbCwgdHJ1ZSk7XG4gICAgfVxuICAgIGlmIChibG9jay5jbG9zZVN0cmlwLm9wZW4pIHtcbiAgICAgIG9taXRMZWZ0KGxhc3RJbnZlcnNlLmJvZHksIG51bGwsIHRydWUpO1xuICAgIH1cblxuICAgIC8vIEZpbmQgc3RhbmRhbG9uZSBlbHNlIHN0YXRtZW50c1xuICAgIGlmICghdGhpcy5vcHRpb25zLmlnbm9yZVN0YW5kYWxvbmVcbiAgICAgICAgJiYgaXNQcmV2V2hpdGVzcGFjZShwcm9ncmFtLmJvZHkpXG4gICAgICAgICYmIGlzTmV4dFdoaXRlc3BhY2UoZmlyc3RJbnZlcnNlLmJvZHkpKSB7XG4gICAgICBvbWl0TGVmdChwcm9ncmFtLmJvZHkpO1xuICAgICAgb21pdFJpZ2h0KGZpcnN0SW52ZXJzZS5ib2R5KTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoYmxvY2suY2xvc2VTdHJpcC5vcGVuKSB7XG4gICAgb21pdExlZnQocHJvZ3JhbS5ib2R5LCBudWxsLCB0cnVlKTtcbiAgfVxuXG4gIHJldHVybiBzdHJpcDtcbn07XG5cbldoaXRlc3BhY2VDb250cm9sLnByb3RvdHlwZS5EZWNvcmF0b3IgPVxuV2hpdGVzcGFjZUNvbnRyb2wucHJvdG90eXBlLk11c3RhY2hlU3RhdGVtZW50ID0gZnVuY3Rpb24obXVzdGFjaGUpIHtcbiAgcmV0dXJuIG11c3RhY2hlLnN0cmlwO1xufTtcblxuV2hpdGVzcGFjZUNvbnRyb2wucHJvdG90eXBlLlBhcnRpYWxTdGF0ZW1lbnQgPVxuICAgIFdoaXRlc3BhY2VDb250cm9sLnByb3RvdHlwZS5Db21tZW50U3RhdGVtZW50ID0gZnVuY3Rpb24obm9kZSkge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBsZXQgc3RyaXAgPSBub2RlLnN0cmlwIHx8IHt9O1xuICByZXR1cm4ge1xuICAgIGlubGluZVN0YW5kYWxvbmU6IHRydWUsXG4gICAgb3Blbjogc3RyaXAub3BlbixcbiAgICBjbG9zZTogc3RyaXAuY2xvc2VcbiAgfTtcbn07XG5cblxuZnVuY3Rpb24gaXNQcmV2V2hpdGVzcGFjZShib2R5LCBpLCBpc1Jvb3QpIHtcbiAgaWYgKGkgPT09IHVuZGVmaW5lZCkge1xuICAgIGkgPSBib2R5Lmxlbmd0aDtcbiAgfVxuXG4gIC8vIE5vZGVzIHRoYXQgZW5kIHdpdGggbmV3bGluZXMgYXJlIGNvbnNpZGVyZWQgd2hpdGVzcGFjZSAoYnV0IGFyZSBzcGVjaWFsXG4gIC8vIGNhc2VkIGZvciBzdHJpcCBvcGVyYXRpb25zKVxuICBsZXQgcHJldiA9IGJvZHlbaSAtIDFdLFxuICAgICAgc2libGluZyA9IGJvZHlbaSAtIDJdO1xuICBpZiAoIXByZXYpIHtcbiAgICByZXR1cm4gaXNSb290O1xuICB9XG5cbiAgaWYgKHByZXYudHlwZSA9PT0gJ0NvbnRlbnRTdGF0ZW1lbnQnKSB7XG4gICAgcmV0dXJuIChzaWJsaW5nIHx8ICFpc1Jvb3QgPyAoL1xccj9cXG5cXHMqPyQvKSA6ICgvKF58XFxyP1xcbilcXHMqPyQvKSkudGVzdChwcmV2Lm9yaWdpbmFsKTtcbiAgfVxufVxuZnVuY3Rpb24gaXNOZXh0V2hpdGVzcGFjZShib2R5LCBpLCBpc1Jvb3QpIHtcbiAgaWYgKGkgPT09IHVuZGVmaW5lZCkge1xuICAgIGkgPSAtMTtcbiAgfVxuXG4gIGxldCBuZXh0ID0gYm9keVtpICsgMV0sXG4gICAgICBzaWJsaW5nID0gYm9keVtpICsgMl07XG4gIGlmICghbmV4dCkge1xuICAgIHJldHVybiBpc1Jvb3Q7XG4gIH1cblxuICBpZiAobmV4dC50eXBlID09PSAnQ29udGVudFN0YXRlbWVudCcpIHtcbiAgICByZXR1cm4gKHNpYmxpbmcgfHwgIWlzUm9vdCA/ICgvXlxccyo/XFxyP1xcbi8pIDogKC9eXFxzKj8oXFxyP1xcbnwkKS8pKS50ZXN0KG5leHQub3JpZ2luYWwpO1xuICB9XG59XG5cbi8vIE1hcmtzIHRoZSBub2RlIHRvIHRoZSByaWdodCBvZiB0aGUgcG9zaXRpb24gYXMgb21pdHRlZC5cbi8vIEkuZS4ge3tmb299fScgJyB3aWxsIG1hcmsgdGhlICcgJyBub2RlIGFzIG9taXR0ZWQuXG4vL1xuLy8gSWYgaSBpcyB1bmRlZmluZWQsIHRoZW4gdGhlIGZpcnN0IGNoaWxkIHdpbGwgYmUgbWFya2VkIGFzIHN1Y2guXG4vL1xuLy8gSWYgbXVsaXRwbGUgaXMgdHJ1dGh5IHRoZW4gYWxsIHdoaXRlc3BhY2Ugd2lsbCBiZSBzdHJpcHBlZCBvdXQgdW50aWwgbm9uLXdoaXRlc3BhY2Vcbi8vIGNvbnRlbnQgaXMgbWV0LlxuZnVuY3Rpb24gb21pdFJpZ2h0KGJvZHksIGksIG11bHRpcGxlKSB7XG4gIGxldCBjdXJyZW50ID0gYm9keVtpID09IG51bGwgPyAwIDogaSArIDFdO1xuICBpZiAoIWN1cnJlbnQgfHwgY3VycmVudC50eXBlICE9PSAnQ29udGVudFN0YXRlbWVudCcgfHwgKCFtdWx0aXBsZSAmJiBjdXJyZW50LnJpZ2h0U3RyaXBwZWQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IG9yaWdpbmFsID0gY3VycmVudC52YWx1ZTtcbiAgY3VycmVudC52YWx1ZSA9IGN1cnJlbnQudmFsdWUucmVwbGFjZShtdWx0aXBsZSA/ICgvXlxccysvKSA6ICgvXlsgXFx0XSpcXHI/XFxuPy8pLCAnJyk7XG4gIGN1cnJlbnQucmlnaHRTdHJpcHBlZCA9IGN1cnJlbnQudmFsdWUgIT09IG9yaWdpbmFsO1xufVxuXG4vLyBNYXJrcyB0aGUgbm9kZSB0byB0aGUgbGVmdCBvZiB0aGUgcG9zaXRpb24gYXMgb21pdHRlZC5cbi8vIEkuZS4gJyAne3tmb299fSB3aWxsIG1hcmsgdGhlICcgJyBub2RlIGFzIG9taXR0ZWQuXG4vL1xuLy8gSWYgaSBpcyB1bmRlZmluZWQgdGhlbiB0aGUgbGFzdCBjaGlsZCB3aWxsIGJlIG1hcmtlZCBhcyBzdWNoLlxuLy9cbi8vIElmIG11bGl0cGxlIGlzIHRydXRoeSB0aGVuIGFsbCB3aGl0ZXNwYWNlIHdpbGwgYmUgc3RyaXBwZWQgb3V0IHVudGlsIG5vbi13aGl0ZXNwYWNlXG4vLyBjb250ZW50IGlzIG1ldC5cbmZ1bmN0aW9uIG9taXRMZWZ0KGJvZHksIGksIG11bHRpcGxlKSB7XG4gIGxldCBjdXJyZW50ID0gYm9keVtpID09IG51bGwgPyBib2R5Lmxlbmd0aCAtIDEgOiBpIC0gMV07XG4gIGlmICghY3VycmVudCB8fCBjdXJyZW50LnR5cGUgIT09ICdDb250ZW50U3RhdGVtZW50JyB8fCAoIW11bHRpcGxlICYmIGN1cnJlbnQubGVmdFN0cmlwcGVkKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFdlIG9taXQgdGhlIGxhc3Qgbm9kZSBpZiBpdCdzIHdoaXRlc3BhY2Ugb25seSBhbmQgbm90IHByZWNlZWRlZCBieSBhIG5vbi1jb250ZW50IG5vZGUuXG4gIGxldCBvcmlnaW5hbCA9IGN1cnJlbnQudmFsdWU7XG4gIGN1cnJlbnQudmFsdWUgPSBjdXJyZW50LnZhbHVlLnJlcGxhY2UobXVsdGlwbGUgPyAoL1xccyskLykgOiAoL1sgXFx0XSskLyksICcnKTtcbiAgY3VycmVudC5sZWZ0U3RyaXBwZWQgPSBjdXJyZW50LnZhbHVlICE9PSBvcmlnaW5hbDtcbiAgcmV0dXJuIGN1cnJlbnQubGVmdFN0cmlwcGVkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBXaGl0ZXNwYWNlQ29udHJvbDtcbiJdfQ==
