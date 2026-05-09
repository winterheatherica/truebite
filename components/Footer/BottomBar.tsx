export default function BottomBar() {
  const year = new Date().getFullYear();

  return (
    <div className="mt-16 border-t border-rp-dark-2 pt-8 text-center">
      <p className="text-xs text-rp-muted">
        &copy; {year} TrueBite. All rights reserved.
      </p>
    </div>
  );
}
